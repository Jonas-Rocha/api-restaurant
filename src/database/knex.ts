/**
 * Arquivo que inicializa a conexão com o banco de dados usando a biblioteca Knex.js.
 */
import { knex as knexConfig } from "knex";

// Importa as configurações do banco definidas na raiz do projeto (como qual banco usar e onde salvar o arquivo SQLite)
import config from "../../knexfile";

// Instancia e exporta a conexão `knex` pronta para ser usada nos controllers
export const knex = knexConfig(config);
