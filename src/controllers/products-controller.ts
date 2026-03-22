/**
 * Controller responsável por todas as funcionalidades relativas aos Produtos (Cardápio).
 * Contém o CRUD: Create (Criar), Read/Index (Listar), Update (Atualizar), Delete/Remove (Deletar).
 */
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { knex } from "@/database/knex";
import { z } from "zod";

class ProductController {
  /**
   * Método GET: Lista todos os produtos ou faz pesquisa/filtro por nome.
   */
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Extrai os dados pesquisados via query params (Ex: /products?name=frango)
      const { name, price } = request.query; 

      const products = await knex<ProductRepository>("products")
        .select()
        // whereLike com %: Busca produtos que contenham aquele texto em qualquer parte do nome.
        // nullish coalescing (?? ""): Faz com que, se o name não for passado na URL,
        // a pesquisa vire uma string vazia ("", que abrange todos os produtos cadastrados).
        .whereLike("name", `%${name ?? ""}%`) 
        .orderBy("name");

      return response.json(products);
    } catch (error) {
      next(error); // Repassando exceções pro middleware tratar e formatar
    }
  }

  /**
   * Método POST: Registra um novo produto no banco.
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Valida com o Zod: string de no mínimo 6 letras pro nome, preço obrigatório maior que zero (gt > 0).
      const bodySchema = z.object({
        name: z.string({ required_error: "name is required" }).trim().min(6),
        price: z.number().gt(0, { message: "Value must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(request.body);

      // Não precisamos importar ProductRepository pois o arquivo de .d.ts fica visível globalmente
      // Grava no banco de dados.
      await knex<ProductRepository>("products").insert({ name, price }); 

      return response.status(201).json(); // Status 201 Created (Criado com Sucesso)
    } catch (error) {
      next(error); 
    }
  }

  /**
   * Método PUT: Atualiza um produto.
   */
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      // Recupera o ID da URL e converte pra número
      const id = z 
        .string() // ID chega como string em req.params...
        .transform((value) => Number(value)) // Convertemos pra uso computacional (number)
        .refine((value) => !isNaN(value), { message: "id must be a number" }) // Valida se n bateu letras em vez de ID númerico
        .parse(request.params.id); 

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0),
      });

      const { name, price } = bodySchema.parse(request.body);

      // Verificamos antes se esse produto lá no banco existe mesmo...
      const product = await knex<ProductRepository>("products")
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("product not found");
      }

      // Feito a checagem que existe: disparamos a atualização.
      // E aproveitamos para preencher forçadamente o updated_at com o momento atual (now)
      await knex<ProductRepository>("products")
        .update({ name, price, updated_at: knex.fn.now() }) 
        .where({ id }); 

      return response.json();
    } catch (error) {
      next(error); 
      // Sem colocar next(error) se houvesse falha o servidor iria travar.
    }
  }

  /**
   * Método DELETE: Remove um produto por ID do banco de dados (Cardápio).
   */
  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      // Podemos reaproveitar só a validação de numero ID pois não mandaremos (body) nessa rota
      const id = z 
        .string() 
        .transform((value) => Number(value)) 
        .refine((value) => !isNaN(value), { message: "id must be a number" }) 
        .parse(request.params.id); 

      const product = await knex<ProductRepository>("products")
        .where({ id })
        .first(); // O first garante que receba um objeto direto. E não precisará procurar no index: product[0].

      if (!product) {
        throw new AppError("product not found");
      }

      // Deleção definitiva pelo ID
      await knex<ProductRepository>("products").delete().where({ id });

      return response.json();
    } catch (error) {
      next(error); 
    }
  }
}

export { ProductController };
