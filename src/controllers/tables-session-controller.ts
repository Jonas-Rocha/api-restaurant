import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/knex";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(),
      });
      const { table_id } = bodySchema.parse(request.body);

      // nesse aqui eu estou simplesmente omitindo o select() e usando diretamente o where(), o table_id: table_id não precisa pois fica reduntante
      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({
          table_id,
        })
        .orderBy("opened_at", "desc") //colocando o orderBy( "desc") ele filtra de forma "decrescente?" e com o first() ele garante pegar o primeiro iten, e não devolte mais um array(lista).
        .first();

      if (session && !session.closed_at) {
        // neste if() eu estou primeiro verificando se tem uma sessão, se tiver, verificar se o closed_at esta NULL "!session.closed_at". Se estiver NULL, deve retornar(lançar) o AppError().
        throw new AppError("this table is already open");
      }

      await knex<TableSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knex<TableSessionsRepository>(
        "tables_sessions",
      ).orderBy(
        // aqui eu posso omitir o select() pq o knex ja vai entender que eu quero fazer a consulta e usar o orderBy().
        // eu só usaria select se eu precisasse selecionar coisas especificas, se eu quero selecionar tudo, o select() pode ser omitido.
        "closed_at",
      );

      return response.json(sessions);
    } catch (error) {}
  }
}

export { TablesSessionsController };
