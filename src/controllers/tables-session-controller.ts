/**
 * Controller focado em Iniciar (abrir) e Finalizar (fechar/pagar) sessões/atendimentos de uma mesa.
 */
import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/knex";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class TablesSessionsController {
  /**
   * Método POST: Senta o cliente na mesa e ABRE uma nova sessão para lançar os pedidos posteriores.
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(), // ID interno de qual mesa o cara sentou (foreign key)
      });
      const { table_id } = bodySchema.parse(request.body);

      // Verificação lógica vital: 
      // Será que a última sessão (a vez passada que usaram essa mesa) já foi encerrada e paga?
      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ table_id })
        // Ordeno de forma descendente no `opened_at` (ou seja, de tras-pra frente) garantindo pegar apenas a mais recente!
        .orderBy("opened_at", "desc") 
        .first(); // o first me assegura de pegar só 1 e sair do return do array

      if (session && !session.closed_at) {
        // Se achei a aba/sessão daquela mesa, e O CAMPO "closed_at" é vazio: significa que a conta ta aberta! 
        throw new AppError("this table is already open");
      }

      // Se passou da etapa acima: Ou a mesa nunca foi usada, ou ela está vaga e pronta
      // Criamos via insert com a data do servidor (knex.fn.now())
      await knex<TablesSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Método GET: Lista todas sessões de controle (tanto atendimentos atuais, quanto contas velhas).
   */
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knex<TablesSessionsRepository>(
        "tables_sessions",
      ).orderBy(
        // Colocando o order by por quem está com data fechada, organizando no front
        "closed_at",
      );

      return response.json(sessions);
    } catch (error) {
      // Adicionado captura do next para evitar travar app no envio via Express
      next(error); 
    }
  }

  /**
   * Método PUT (ou update): Fechar a conta (Sessão), liberando a mesa pra o próximo.
   */
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      // Validando o ID da sessão da mesa que vem através do param/URL:
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(request.params.id);

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id })
        .first();

      if (!session) {
        throw new AppError("session table not found");
      }

      // Caso você re-clique no fechamento que já tava pago, o backend corta a execução!
      if (session.closed_at) {
        throw new AppError("this session table is already closed");
      }

      // Processo de encerramento prático no DB: Setando o `closed_at`
      await knex<TablesSessionsRepository>("tables_sessions")
        .update({
          closed_at: knex.fn.now(),
        })
        .where({ id });

      response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };
