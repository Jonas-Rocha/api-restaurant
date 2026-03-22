/**
 * Controller de leitura das Mesas Físicas.
 * Exibe as mesas cadastradas pelo restaurante.
 */
import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/knex";

class TablesController {
  /**
   * Método GET para apresentar a lista de mesas e organizá-la visivelmente.
   */
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Busca da tabela "tables"
      const tables = await knex<TableRepository>("tables")
        .select()
        // orderBy garante que sempre vejamos na lista Mesa 1, Mesa 2, independente de ordem de cadastro
        .orderBy("table_number");

      response.json(tables);
    } catch (error) {
      next(error);
    }
  }
}

export { TablesController };
