const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const app = express();

// Configuração do CORS
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:4200', 'http://localhost:8100'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 🔐 TABELAS PERMITIDAS
const allowedTables = [
  'funcionarios',
  'salas',
  'disponibilidades',
  'reservas',
  'logs',
  'permissoes',
  'recursos',
  'perfis'
];

function validateTable(table) {
  if (!allowedTables.includes(table)) {
    throw new Error('Tabela inválida');
  }
}

function formatDateToMySQL(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// 🔥 FUNÇÃO PARA CRIAR AS TABELAS USANDO O ARQUIVO schema.sql
async function initDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
      multipleStatements: true
    });

    console.log('⚙️ Inicializando banco de dados...');

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      console.log('📄 Executando schema.sql...');
      await connection.query(sql);
      console.log('✅ Schema.sql executado com sucesso!');
    } else {
      console.log('⚠️ Arquivo schema.sql não encontrado!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
  } finally {
    if (connection) await connection.end();
  }
}

// 🔥 FUNÇÃO PARA GARANTIR QUE O ADMIN EXISTE
async function ensureAdmin() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT)
    });

    await connection.query(`USE ${process.env.DB_NAME}`);

    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'funcionarios'"
    );
    
    if (tables.length === 0) {
      console.log('⚠️ Tabela funcionarios não existe ainda, aguardando criação...');
      return;
    }

    const [rows] = await connection.query(
      'SELECT id FROM funcionarios WHERE email = ?',
      [process.env.ADMIN_EMAIL || 'admin@saae.com']
    );

    if (rows.length === 0) {
      console.log('⚠️ Admin não encontrado. Criando...');
      
      const hash = process.env.ADMIN_PASSWORD_HASH || '$2a$10$e8idlDTcNYKwUgX2SURJ/OR3tDSgLNZcBOOF10P6uLMDILcXyPNfm';
      
      await connection.query(
        `INSERT INTO funcionarios (nome, email, telefone, tipo, password, protegido, createdAt) 
         VALUES (?, ?, ?, ?, ?, true, NOW())`,
        [
          process.env.ADMIN_NOME || 'Administrador',
          process.env.ADMIN_EMAIL || 'admin@saae.com',
          process.env.ADMIN_TELEFONE || '(11) 99999-9999',
          process.env.ADMIN_TIPO || 'Chefe de TI',
          hash
        ]
      );
      
      console.log('✅ Admin criado com sucesso!');
    } else {
      console.log('✅ Admin já existe no banco');
    }
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
  } finally {
    if (connection) await connection.end();
  }
}

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MariaDB com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

// 🔥 INICIALIZAÇÃO
(async () => {
  await initDatabase();
  await ensureAdmin();
  await testConnection();
})();

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

// ============= ROTAS DE AUTENTICAÇÃO (ESPECÍFICAS - VÊM PRIMEIRO) =============
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM funcionarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        tipo: user.tipo,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true });
});

// 🔥 MIDDLEWARE PARA VERIFICAR AUTENTICAÇÃO
async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, telefone, tipo, createdAt FROM funcionarios WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para disponibilidade para todos os dias (ESPECÍFICA)
app.post('/api/disponibilidades/todos-dias', authMiddleware, async (req, res) => {
  const { salaId, nomeSala, horarios, ativo } = req.body;
  
  try {
    const dias = [
      { valor: 1, nome: 'Segunda-feira' },
      { valor: 2, nome: 'Terça-feira' },
      { valor: 3, nome: 'Quarta-feira' },
      { valor: 4, nome: 'Quinta-feira' },
      { valor: 5, nome: 'Sexta-feira' }
    ];
    
    for (const dia of dias) {
      const [existing] = await pool.query(
        'SELECT id FROM disponibilidades WHERE salaId = ? AND diaSemana = ?',
        [salaId, dia.valor]
      );
      
      if (existing.length > 0) {
        await pool.query(
          'UPDATE disponibilidades SET horarios = ?, ativo = ? WHERE id = ?',
          [JSON.stringify(horarios), ativo, existing[0].id]
        );
      } else {
        await pool.query(
          'INSERT INTO disponibilidades (salaId, nomeSala, diaSemana, diaNome, horarios, ativo) VALUES (?, ?, ?, ?, ?, ?)',
          [salaId, nomeSala, dia.valor, dia.nome, JSON.stringify(horarios), ativo]
        );
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao criar disponibilidades:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============= CRUD GENÉRICO (DEPOIS DAS ROTAS ESPECÍFICAS) =============

// GET all
app.get('/api/:table', async (req, res) => {
  try {
    validateTable(req.params.table);
    const [rows] = await pool.query(`SELECT * FROM ${req.params.table}`);
    res.json(rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET with query params
app.get('/api/:table/query', async (req, res) => {
  try {
    validateTable(req.params.table);

    const conditions = [];
    const values = [];

    for (const [key, value] of Object.entries(req.query)) {
      if (['orderBy', 'order', 'limite'].includes(key)) continue;
      conditions.push(`${key} = ?`);
      values.push(value);
    }

    let sql = `SELECT * FROM ${req.params.table}`;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const allowedColumns = ['id', 'nome', 'email', 'data', 'createdAt', 'updatedAt'];
    let orderBy = req.query.orderBy;
    let order = req.query.order === 'DESC' ? 'DESC' : 'ASC';

    if (orderBy && !allowedColumns.includes(orderBy)) {
      return res.status(400).json({ error: 'Coluna inválida' });
    }

    if (orderBy) {
      sql += ` ORDER BY ${orderBy} ${order}`;
    }

    if (req.query.limite) {
      sql += ` LIMIT ${parseInt(req.query.limite)}`;
    }

    const [rows] = await pool.query(sql, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET by id
app.get('/api/:table/:id', async (req, res) => {
  try {
    validateTable(req.params.table);

    if (req.params.table === 'permissoes') {
      const [rows] = await pool.query(
        `SELECT * FROM ${req.params.table} WHERE perfil = ?`,
        [req.params.id]
      );
      res.json(rows[0] || null);
    } else {
      const [rows] = await pool.query(
        `SELECT * FROM ${req.params.table} WHERE id = ?`,
        [req.params.id]
      );
      res.json(rows[0] || null);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create
app.post('/api/:table', async (req, res) => {
  try {
    validateTable(req.params.table);

    if (req.params.table !== 'funcionarios') {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Não autenticado' });
      }
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'secret');
      } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
      }
    }

    let data = { ...req.body };

    if (data.createdAt) data.createdAt = formatDateToMySQL(data.createdAt);
    if (data.updatedAt) data.updatedAt = formatDateToMySQL(data.updatedAt);
    if (data.data) data.data = data.data.split('T')[0];

    for (let key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = JSON.stringify(data[key]);
      }
    }

    if (req.params.table === 'funcionarios' && data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const result = await pool.query(
      `INSERT INTO ${req.params.table} SET ?`,
      [data]
    );

    res.json({ id: result[0].insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update
app.put('/api/:table/:id', authMiddleware, async (req, res) => {
  try {
    validateTable(req.params.table);

    if (req.params.table === 'funcionarios') {
      const [rows] = await pool.query(
        'SELECT email, protegido FROM funcionarios WHERE id = ?',
        [req.params.id]
      );
      
      if (rows.length > 0 && (rows[0].email === (process.env.ADMIN_EMAIL || 'admin@saae.com') || rows[0].protegido === 1)) {
        if (req.body.email || req.body.tipo || req.body.password) {
          return res.status(403).json({ error: 'Não é possível alterar email, tipo ou senha do administrador' });
        }
      }
    }

    let data = { ...req.body };

    if (data.createdAt) data.createdAt = formatDateToMySQL(data.createdAt);
    if (data.updatedAt) data.updatedAt = formatDateToMySQL(data.updatedAt);

    for (let key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = JSON.stringify(data[key]);
      }
    }

    if (req.params.table === 'funcionarios' && data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    if (req.params.table === 'permissoes') {
      await pool.query(
        `UPDATE ${req.params.table} SET ? WHERE perfil = ?`,
        [data, req.params.id]
      );
    } else {
      await pool.query(
        `UPDATE ${req.params.table} SET ? WHERE id = ?`,
        [data, req.params.id]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/api/:table/:id', authMiddleware, async (req, res) => {
  try {
    validateTable(req.params.table);

    if (req.params.table === 'funcionarios') {
      const [rows] = await pool.query(
        'SELECT email, protegido FROM funcionarios WHERE id = ?',
        [req.params.id]
      );
      
      if (rows.length > 0 && (rows[0].email === (process.env.ADMIN_EMAIL || 'admin@saae.com') || rows[0].protegido === 1)) {
        return res.status(403).json({ error: 'Usuário administrador não pode ser excluído' });
      }
    }

    if (req.params.table === 'permissoes') {
      await pool.query(
        `DELETE FROM ${req.params.table} WHERE perfil = ?`,
        [req.params.id]
      );
    } else {
      await pool.query(
        `DELETE FROM ${req.params.table} WHERE id = ?`,
        [req.params.id]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Banco: ${process.env.DB_NAME}`);
  console.log(`🔗 API: http://localhost:${PORT}/api\n`);
});