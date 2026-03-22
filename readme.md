# API Restaurant - Documentação de Estudo

Este projeto é uma API Backend desenvolvida para o gerenciamento de um restaurante. O objetivo principal deste repositório é servir como base de estudos em desenvolvimento backend com Node.js e TypeScript, aplicando boas práticas de organização de código, banco de dados relacionais e validação de dados.

## Tecnologias Utilizadas

O ecossistema do projeto foi construído utilizando as seguintes tecnologias:

* Node.js: Ambiente de execução JavaScript/TypeScript para o servidor.
* TypeScript: Superconjunto do JavaScript que adiciona tipagem estática, garantindo maior segurança e previsibilidade do código.
* Express: Framework minimalista para criação das rotas e gerenciamento das portas de rede.
* Knex.js: Construtor de consultas SQL (Query Builder) utilizado para interagir com o banco de dados e gerenciar as Migrations e Seeds.
* Zod: Biblioteca focada em validação e sanitização de dados recebidos pelas requisições.

## Arquitetura e Estrutura

O código-fonte principal está contido na pasta `src/`, que se divide de forma organizada seguindo separação de responsabilidades:

* Controllers: Camada responsável por receber as requisições (Request), processar a lógica de negócio e devolver uma resposta (Response).
* Rotas (Routes): Camada que mapeia as URLs (endpoints) para seus respectivos métodos nos controllers.
* Database: Centraliza toda a infraestrutura de dados.
  * Migrations: Scripts de versionamento para criação e alteração da estrutura das tabelas.
  * Seeds: Scripts para inserção de dados iniciais no banco, como os produtos iniciais e mesas do salão.
  * Types: Centralização da tipagem (contratos/interfaces) das tabelas para o auxílio do desenvolvedor e do TypeScript.
* Middlewares: Camada que intercepta requisições. Usada principalmente para o fechamento e tratamento global padronizado de erros.
* Utils: Funções ou classes utilitárias em comum, como a classe de Exceções Dedicadas (AppError).

## Funcionalidades Implementadas

O sistema dispõe de funcionalidades especializadas para o gerenciamento do salão de um restaurante de forma prática:

### Gestão de Produtos (Cardápio)
* Registro de novos produtos exigindo nome (maior que 6 caracteres) e preço superior a zero validado de forma reforçada.
* Consulta do cardápio completo com suporte a busca textual fragmentada pelo nome do produto.
* Edição pontual e inteligente das propriedades de um produto.
* Exclusão e remoção total de itens antigos do cardápio.

### Gestão de Mesas Físicas
* Identificação e listagem ordenada das mesas disponíveis no restaurante.

### Controle de Atendimento (Sessões das Mesas)
* Abertura de conta vinculada à chegada de um cliente na mesa. O sistema possui trava para impedir que a mesa, uma vez ocupada, sofra reaberturas acidentais.
* Listagem do fluxo e histórico das contas, permitindo enxergar desde contas recém-abertas até caixas fechados no passado.
* Encerramento da sessão (fechamento de conta), documentando o instante de liberação da mesa via banco de dados.

### Gestão de Pedidos (Orders)
* Comando de pedidos atrelando um produto consumido para uma mesa já instanciada e aberta.
* Proteção fundamental do caixa: O preço no segundo exato do pedido é encapsulado no histórico da tabela de pedidos, protegendo contra futuros reajustes no cardápio que destruiriam históricos antigos de vendas se consultados dinamicamente de forma errada.
* Detalhamento de tudo o que foi consumido por certa mesa em forma de lista, exibindo as quantias e a projeção visual do total unitário de forma conjunta.
* Fechamento dinâmico calculando automaticamente o valor geral gasto com base na soma universal de todos os itens consumidos (Total Subtotal).

## Considerações Finais

O projeto se encontra altamente documentado e comentado linha a linha com fins educacionais na pasta `src/`. Todo o fluxo foi planejado para devolver ao usuário uma visão assertiva, além disto, há um middleware voltado para reajustar todo e qual quer problema interno para status HTTP legíveis evitando telas mortas do framework base.
