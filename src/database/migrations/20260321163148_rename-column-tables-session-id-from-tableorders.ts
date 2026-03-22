/**
 * Migration de Correção!
 * Em vez de pagar tudo e fazer de novo, usamos migrations para corrigir nomes e formatos do banco.
 * Essa migration altera o nome "tables_session_id" para "table_session_id" (singular).
 */
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.renameColumn("tables_session_id", "table_session_id");
  });
}

// O método `down` é o processo de "desfazer", refazendo pro nome de coluna errado anterior
export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("orders", (table) => {
    table.renameColumn("table_session_id", "tables_session_id");
  });
}
