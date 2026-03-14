import { NextFunction, Request, Response } from "express";
// import { AppError } from "@/utils/AppError"; (não esta usando ainda)
import { knex } from "@/database/migrations/knex";
import { z } from "zod";

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      //   throw new AppError("Erro de teste", 501);  << erro de teste
      return response.json({ message: "Ok" });
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string({ required_error: "name is required" }).trim().min(6),
        price: z.number().gt(0, { message: "Value must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(request.body);

      await knex<ProductRepository>("products").insert({ name, price }); // Não precisa importar, o arquivo de tipagem fica disponivel globalmente

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
