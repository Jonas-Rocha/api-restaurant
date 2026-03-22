/**
 * Middleware global para tratamento e interceptação de erros.
 * Este middleware captura qualquer exceção gerada dentro das rotas ou controllers,
 * loga, formata e devolve uma resposta HTTP padronizada para o usuário (cliente).
 */
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

export function errorHandling(
  error: any,
  request: Request,
  response: Response,
  _: NextFunction,
) {
  // Se o erro foi instanciado pela nossa classe AppError (erro de regra de negócio conhecido/esperado)
  if (error instanceof AppError) {
    // Retornamos o status configurado e a mensagem especificada no momento do erro
    return response.status(error.statusCode).json({ message: error.message });
  }

  // Se o erro foi lançado pelo Zod (biblioteca de validação de dados),
  // significa que na requisição faltaram campos ou os tipos enviados estão incorretos.
  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ message: "validation error", issues: error.format() });
  }
  
  // Caso seja um erro completamente inesperado (ex: banco de dados offline, falha de infraestrutura),
  // tratamos como um Erro Interno do Servidor (Status 500)
  return response.status(500).json({ message: error.message });
}
