/**
 * Arquivo Principal das Rotas.
 * Ele agrupa todas as rotas (produtos, mesas, pedidos) em um só lugar de forma limpa.
 * O server.ts importa apenas este arquivo para ativar todos os caminhos da aplicação.
 */
import { Router } from "express";

// Importa cada grupo de rota específica
import { tablesSessionsRoutes } from "./tables-sessions-routes";
import { productsRoutes } from "./products-routes";
import { tablesRoutes } from "./tables-routes";
import { ordersRoutes } from "./orders-routes";

const routes = Router();

// Toda rota que começar com "/tables-sessions" vai ser mandada para o arquivo tablesSessionsRoutes lidar
routes.use("/tables-sessions", tablesSessionsRoutes);

// Toda rota que começar com "/products" (ex: GET /products ou POST /products) será mandada pro productsRoutes
routes.use("/products", productsRoutes);

routes.use("/tables", tablesRoutes);
routes.use("/orders", ordersRoutes);

export { routes };
