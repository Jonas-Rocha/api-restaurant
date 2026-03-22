/**
 * Migration para criar a tabela "products" no banco de dados.
 * As migrations funcionam como um versionamento do esquema do banco de dados (ex: git para banco de dados).
 */
import type { Knex } from "knex";

// O método `up` define as alterações inseridas quando rodamos a migration (ex: cria a tabela)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary(); // ID é chave primária com auto-incremento
    table.text("name").notNullable(); // Nome do produto, é obrigatório (notNullable)
    table.decimal("price").notNullable(); // Preço do produto, obrigatório
    table.timestamp("created_at").defaultTo(knex.fn.now()); // fn.now() insere as data e horas automaticamente
    table.timestamp("updated_at").defaultTo(knex.fn.now()); 
  });
}

// O método `down` é usado para reverter a migration, apagando tudo o que ela fez (útil em caso de erro ou rollback)
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products");
}
