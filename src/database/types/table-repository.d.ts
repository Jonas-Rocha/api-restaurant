/**
 * Definição (tipagem) da estrutura de uma Mesa (Table) do restaurante.
 */
type TableRepository = {
  id: number;
  table_number: number; // O número visível da mesa no restaurante (ex: Mesa 1, Mesa 12)
  created_at: number;
  updated_at: number;
};
