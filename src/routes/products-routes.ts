import { Router } from "express";
import { ProductController } from "@/controllers/products-controller";

const productsRoutes = Router();
const productsController = new ProductController();

productsRoutes.get("/", productsController.index);
productsRoutes.post("/", productsController.create);
productsRoutes.put("/:id", productsController.update); // o :id para capturar o produto a ser atualizado.
productsRoutes.delete("/:id", productsController.remove);
export { productsRoutes };
