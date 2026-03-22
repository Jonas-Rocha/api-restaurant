/**
 * Definição (tipagem) da estrutura de uma Sessão de Mesa.
 * Uma sessão indica o período que clientes estão ocupando a mesa (desde abrir até fechar/pagar).
 */
type TablesSessionsRepository = {
  id: number;
  table_id: number;   // FK (Chave estrangeira) ligando esta sessão a uma mesa real
  opened_at: number;  // Timestamp de quando a mesa foi aberta
  closed_at: number;  // Timestamp de quando a conta da mesa foi fechada (null se estiver em aberto)
};
