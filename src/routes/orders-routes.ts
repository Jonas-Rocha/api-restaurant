/**
 * Definições das Rotas de Pedidos (Orders).
 * Faz a ligação entre as URLs acessadas pelo usuário/frontend e as funções no OrdersController.
 */
import { Router } from "express";
import { OrdersController } from "@/controllers/orders-controller";

const ordersRoutes = Router();
const ordersController = new OrdersController();

// Rota POST /orders: Cria um novo pedido na mesa
ordersRoutes.post("/", ordersController.create);

// Rota GET /orders/table-session/:id/total: Retorna a soma do valor total consumido daquela sessão de mesa
ordersRoutes.get(
  "/table-session/:table_session_id/total",
  ordersController.show,
);

// Rota GET /orders/table-session/:id: Lista todos os itens feitos (detalhamento) na conta da mesa
ordersRoutes.get("/table-session/:table_session_id", ordersController.index);

export { ordersRoutes };
