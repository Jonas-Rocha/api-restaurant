/**
 * Definição (tipagem) da estrutura de um Pedido (Order) na tabela do banco de dados.
 * Ajuda o Typescript a sugerir opções (autocompletar) e validar os dados de pedido.
 */
type OrderRepository = {
  id: number;
  table_session_id: number; // Relaciona o pedido a uma sessão específica de uma mesa
  product_id: number;       // Qual produto foi pedido
  quantity: number;         // Quantidade comprada desse produto
  price: number;            // Preço unitário do produto no momento do pedido
  created_at: number;
  updated_at: number;
};
