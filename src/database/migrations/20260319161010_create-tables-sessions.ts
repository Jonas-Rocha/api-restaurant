/**
 * Migration para criar a tabela "tables_sessions" (sessões das mesas).
 * Sempre que um cliente senta na mesa, abrimos uma sessão para aglomerar os pedidos pendentes dele.
 */
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables_sessions", (table) => {
    table.increments("id").primary();
    
    // table_id é uma foreign key (chave estrangeira) referenciando qual mesa física estamos tratando
    table.integer("table_id").notNullable().references("id").inTable("tables");
    
    table.timestamp("opened_at").defaultTo(knex.fn.now()); // Data de abertura da sessão (quando sentaram)
    table.timestamp("closed_at"); // Data de encerramento da sessão (quando pagaram a conta), nulo inicialmente
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tables_sessions"); // Remove a tabela (Corrigido caso houvesse escrita errada como table_sessions)
}
