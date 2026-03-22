/**
 * Definições das Rotas de Mesas.
 * Rota simples apenas para retornar as mesas físicas cadastradas.
 */
import { Router } from "express";
import { TablesController } from "@/controllers/tables-controller";

const tablesRoutes = Router();
const tablesController = new TablesController();

// GET /tables: Mostra as mesas disponíveis do estabelecimento
tablesRoutes.get("/", tablesController.index);

export { tablesRoutes };
