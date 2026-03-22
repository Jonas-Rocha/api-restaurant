/**
 * Definições das Rotas de Produtos.
 * Liga os caminhos de URL referentes ao cardápio com os métodos CRUD de ProductController.
 */
import { Router } from "express";
import { ProductController } from "@/controllers/products-controller";

const productsRoutes = Router();
const productsController = new ProductController();

// GET /products: Lista ou pesquisa produtos
productsRoutes.get("/", productsController.index);

// POST /products: Cria um novo produto (insere no cardápio)
productsRoutes.post("/", productsController.create);

// PUT /products/:id: Atualiza um produto. O ":id" avisa o express para capturar aquele trecho dinâmico da URL dinamicamente
productsRoutes.put("/:id", productsController.update);

// DELETE /products/:id: APAGA o produto em questão do cardápio
productsRoutes.delete("/:id", productsController.remove);

export { productsRoutes };
