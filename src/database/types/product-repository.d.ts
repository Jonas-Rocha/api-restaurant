/**
 * Definição (tipagem) da estrutura de um Produto na tabela do banco de dados.
 */
type ProductRepository = {
  id: number;
  name: string;   // Nome/Descrição do produto ofertado
  price: number;  // Preço atual do produto
  created_at: number;
  updated_at: number;
};
