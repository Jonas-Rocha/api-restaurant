/**
 * Migration criando a tabela "orders" (pedidos).
 * Serve para armazenar cada item específico que um cliente pede enquanto está na mesa (sessão).
 */
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    
    // foreign key: Vincula este item na ficha de pedidos a uma sessão de mesa (conta do cliente atual)
    table.integer("tables_session_id").notNullable().references("id").inTable("tables_sessions");
    
    // foreign key: Refere-se a qual produto comprou do cardápio
    table.integer("product_id").notNullable().references("id").inTable("products");
    
    table.integer("quantity").notNullable(); // Quantidade de itens desse produto no mesmo pedido
    table.decimal("price").notNullable(); // Preço gravado na hora do pedido

    // Observação importante: Gravamos um "price" aqui (na order) em vez de apenas linkar com o preço de "products",
    // pois assim garantimos a integridade do histórico do pedido a longo prazo, mesmo se o dono 
    // do restaurante subir o valor do refrigerante na semana que vem.
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Não criamos chave extra para guardar o subtotal, pois isso é uma conta dinâmica com base
    // em multiplicar quantity(quantidade) x price(preço unitário histórico gravado acima).
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders");
}
