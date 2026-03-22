/**
 * Migration para criar a tabela de mesas ("tables").
 * Aqui guardamos as mesas físicas do restaurante.
 */
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables", (table) => {
    table.increments("id").primary(); // ID único interno de cada mesa
    table.integer("table_number").notNullable(); // O número visível da mesa pelo cliente (Mesa 01, 02)
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tables"); // Remove a tabela completa caso faça o rollback
}
