import { NOTINITIALIZED } from "dns";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    ((table.increments("id").primary(),
    table
      .integer("tables_session_id")
      .notNullable()
      .references("id")
      .inTable("tables_sessions"),
    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")),
      table.integer("quantity").notNullable(),
      table.decimal("price").notNullable(),
      //aqui estou criando um price diferente da tabela products pois seria problematico um pedido antigo sofrer alterações dos preços atuais.
      // um refrigerante pode custar 10$, e ele vai para o pedido com esse valor.
      // Se eu mudasse o preço do refrigerante, por reaproveitar a coluna price da tabela products, todos os pedidos encerrados sofreriam mudança de valor e perderiamos o histórico de valor de pedidos antigos.
      table.timestamp("created_at").defaultTo(knex.fn.now()),
      table.timestamp("updated_at").defaultTo(knex.fn.now()));

    //não precisamos acrescentar uma coluna para calcular o total, pois podemos fazer isso dinamicamente, se temos um quantity e um price, é só multiplicar um pelo outro.
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders");
}
