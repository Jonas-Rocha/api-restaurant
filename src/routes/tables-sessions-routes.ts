/**
 * Definições das Rotas das Sessões da Mesa (Atendimentos/Contas).
 * Vincula a URL para abrir ou fechar as contas.
 */
import { Router } from "express";
import { TablesSessionsController } from "@/controllers/tables-session-controller";

const tablesSessionsRoutes = Router();
const tablesSessionsController = new TablesSessionsController();

// POST /tables-sessions: Senta cliente, abri nova conta (sessão) vinculada a uma mesa.
tablesSessionsRoutes.post("/", tablesSessionsController.create);

// GET /tables-sessions: Listagem geral das contas abertas ou antigas.
tablesSessionsRoutes.get("/", tablesSessionsController.index);

// PATCH /tables-sessions/:id: Fecha especificamente a conta com aquele id.
// Dica: Usamos PATCH porque queremos atualizar de forma pontual APENAS o campo `closed_at`. (Enquanto PUT seria para trocar o objeto inteiro).
tablesSessionsRoutes.patch("/:id", tablesSessionsController.update);

export { tablesSessionsRoutes };
