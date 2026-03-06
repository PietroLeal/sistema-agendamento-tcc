export class DateUtils {
  
  /**
   * Retorna a data atual no formato YYYY-MM-DD
   */
  static today(): string {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }

  /**
   * Converte uma data (Date ou string) para o formato YYYY-MM-DD
   */
  static toISODate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  /**
   * Converte uma data (Date ou string) para o formato DD/MM/YYYY
   */
  static toBR(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  }

  /**
   * Retorna a diferença entre duas datas em dias.
   */
  static diffDays(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    const diff = d2 - d1;

    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Soma dias a uma data e retorna no formato Date
   */
  static addDays(date: Date | string, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  /**
   * Verifica se a primeira data é anterior à segunda
   */
  static isBefore(a: Date | string, b: Date | string): boolean {
    return new Date(a).getTime() < new Date(b).getTime();
  }

  /**
   * Verifica se a primeira data é posterior à segunda
   */
  static isAfter(a: Date | string, b: Date | string): boolean {
    return new Date(a).getTime() > new Date(b).getTime();
  }

  /**
   * Checa se duas datas representam o mesmo dia
   */
  static isSameDay(a: Date | string, b: Date | string): boolean {
    const d1 = new Date(a);
    const d2 = new Date(b);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
}
