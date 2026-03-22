/**
 * Seed (Semente) para cadastrar automaticamente no banco as mesas físicas disponíveis no restaurante.
 */
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Limpa (deleta) todas as mesas cadastradas anteriormente (evita duplicar quando rodamos de novo o knex seed:run)
  await knex("tables").del();

  // Insere (cadastra) as mesas de número 1 a 5
  await knex("tables").insert([
    { table_number: 1 },
    { table_number: 2 },
    { table_number: 3 },
    { table_number: 4 },
    { table_number: 5 },
  ]);
}
