/**
 * Ponto de entrada (Entry point) da nossa aplicação.
 * É aqui que configuramos e executamos o servidor backend usando o framework Express.
 */
import express from "express";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

// Define a porta em que o servidor vai rodar (localhost:3333)
const PORT = 3333;

// Inicializa a aplicação Express
const app = express();

// Middleware que ensina o Express a ler e entender requisições com dados no formato JSON
app.use(express.json());

// Registra todas as rotas da nossa aplicação (importadas de ./routes)
app.use(routes);

// Registra o middleware global de tratamento de erros
// Importante: deve ser adicionado sempre DEPOIS das rotas, para capturar os erros ocorridos nelas
app.use(errorHandling);

// Inicia o servidor para escutar requisições na porta especificada
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Configurando variáveis de ambiente lá no insomnia
