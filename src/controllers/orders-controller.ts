/**
 * Controller responsável por gerenciar os Pedidos (Orders).
 * Adiciona produtos à conta de uma mesa e lista o resumo do que foi pedido.
 */
import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class OrdersController {
  /**
   * Método POST para criar um novo pedido (adicionar um item à conta da mesa)
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Validamos o corpo da requisição usando Zod para garantir que recebemos os dados certos
      const bodySchema = z.object({
        table_session_id: z.number(), // ID da sessão da mesa aberta
        product_id: z.number(),       // ID do produto que o cliente pediu
        quantity: z.number(),         // Quantidade do produto
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        request.body,
      );

      // Verificamos se a sessão da mesa realmente existe no banco de dados
      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id: table_session_id })
        .first();

      if (!session) {
        throw new AppError("sessions table not found");
      }

      // Se a mesa já foi fechada/paga (closed_at não for nulo), não podemos adicionar mais pedidos
      if (session.closed_at) {
        throw new AppError("this table is closed");
      }

      // Buscamos o produto no banco para pegar o preço atual dele
      const product = await knex<ProductRepository>("products")
        .where({ id: product_id })
        .first();

      if (!product) {
        throw new AppError("product not found");
      }

      // Inserimos o pedido no banco de dados
      await knex<OrderRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        // Aprendizado importante: Copiamos o preço atual do produto para dentro do pedido.
        // Assim, se o preço do cardápio mudar amanhã, o histórico de fechamento de caixa de hoje não será afetado.
        price: product.price, 
      });

      return response.status(201).json();
    } catch (error) {
      next(error); // Repassa o erro para nosso middleware global (error-handling.ts)
    }
  }

  /**
   * Método GET para listar todos os pedidos de uma sessão específica.
   */
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Como o table_session_id vem pelos parâmetros da URL (ex: /orders/table-session/1)
      // é mais prático extrair dali. Não precisa validar com zod o body.
      const { table_session_id } = request.params; 

      const order = await knex("orders")
        .select(
          // Especificamos a tabela na frente da coluna ("orders.id") para evitar erro de ambiguidade
          // caso a tabela products também tenha colunas com os mesmos nomes (ex: id, created_at).
          "orders.id",
          "orders.table_session_id",
          "orders.product_id",
          "products.name", // Traz o nome do produto através do JOIN
          "orders.price",
          "orders.quantity",
          // Criamos uma coluna virtual chamada "Total" calculando o subtotal baseando-se em (price * quantity)
          knex.raw("(orders.price * orders.quantity) as Total"),
          "orders.created_at",
          "orders.updated_at",
        ) 
        // Fazemos um JOIN (junção) com a tabela products cruzando products.id = orders.product_id
        .join("products", "products.id", "orders.product_id")
        .where({ table_session_id })
        .orderBy("orders.created_at", "desc"); // Ordena trazendo os pedidos mais recentes pro topo

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Método GET (/orders/table-session/:table_session_id/total) para exibir o somatório geral da conta.
   */
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params;

      const order = await knex("orders")
        .select(
          // COALESCE aqui é o "salvador": Ele retorna 0 caso a soma original seja NULL 
          // (ou seja, quando a mesa foi aberta mas ainda sofreu pedidos).
          // SUM() faz o papel de somar todos os valores para dar o grand total da conta.
          knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"), 
          knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity"),
        )
        .where({ table_session_id })
        .first(); // Usamos first() para pegar um único resultado/objeto (invés de lista array completa)

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
