import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { knex } from "@/database/knex";
import { z } from "zod";

class ProductController {
  //LISTANDO OS PRODUTOS
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      //   throw new AppError("Erro de teste", 501);  << erro de teste
      const { name, price } = request.query; // entender ainda mais o query e body

      const products = await knex<ProductRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`) // se tiver um nome na query(parametro de busca), buscará pelo nome, se não, mostrará todos. operador nullish(??).  O % significa que tanto nomes que comecem com ou terminem com {name} devem aparecer.
        .orderBy("name");

      return response.json(products);
    } catch (error) {
      next(error); // usando a função next para "passar o erro para frente" e ser tratado pelo middleware
    }
  }

  //CRIANDO OS PRODUTOS
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
      next(error); // usando a função next para "passar o erro para frente" e ser tratado pelo middleware
    }
  }

  //ATUALIZANDO OS PRODUTOS
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z //validando com o zod
        .string() // ele já chega como string, então eu recupero ele como string.
        .transform((value) => Number(value)) // transformo em number
        .refine((value) => !isNaN(value), { message: "id must be a number" }) // faço uma verificação se é mesmo number
        .parse(request.params.id); // e depois recupero o id

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0),
      });

      const { name, price } = bodySchema.parse(request.body);

      const product = await knex<ProductRepository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("product not found");
      }

      await knex<ProductRepository>("products")
        .update({ name, price, updated_at: knex.fn.now() }) // lembrando, esse update é o metodo pronto do knex e não esse controler que criei(update)
        .where({ id }); // id que seja o mesmo validado pelo zod

      return response.json();
    } catch (error) {
      next(error); // usando a função next para "passar o erro para frente" e ser tratado pelo middleware
      //Se não usar o next() aqui, o erro será capturado mas não será feito nada com ele. não será passado para "frente" para ser tratado
    }
  }

  //REMOVENDO OS PRODUTOS
  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      //como eu preciso apenas do id para remover um produto, posso apenas copiar essa validação do zod.
      const id = z //validando com o zod
        .string() // ele já chega como string, então eu recupero ele como string.
        .transform((value) => Number(value)) // transformo em number
        .refine((value) => !isNaN(value), { message: "id must be a number" }) // faço uma verificação se é mesmo number
        .parse(request.params.id); // e depois recupero o id

      const product = await knex<ProductRepository>("products")
        .select()
        .where({ id })
        .first(); // o first serve para pegar apenas o primeiro(e consequentemente o único) que tiver o {id} filtrado pelo .where(), pois esta retornando um array, o first serve para pegar apenas o primeiro da lista.

      if (!product) {
        throw new AppError("product not found");
      }

      await knex<ProductRepository>("products").delete().where({ id });

      return response.json();
    } catch (error) {
      next(error); // depois de capturar o erro, preciso passar ele pra "frente", para ser tratado. se não, o erro é capturado mas não é tratado e não acontece nada, por isso o next()
    }
  }
}

export { ProductController };
