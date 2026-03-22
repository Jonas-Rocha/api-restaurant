/**
 * Classe responsável por padronizar os erros causados por regras de negócio e validações (erros esperados).
 * Ela nos permite disparar uma exceção que contém tanto uma mensagem personalizada quanto
 * um código de status HTTP adequado (ex: 400 Bad Request, 404 Not Found, 401 Unauthorized).
 */
class AppError {
  message: string;
  statusCode: number;

  /**
   * O construtor é executado toda vez que fazemos um `new AppError("...", status)`.
   * Se não passarmos o statusCode, ele assumirá o valor padrão de 400 (Erro do Cliente).
   */
  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { AppError };
