# Acervo Digital

**Acervo Digital** é um projeto educacional desenvolvido para ensinar
conceitos avançados de **programação web back-end** para alunos do
ensino médio.

Este projeto é uma **continuação direta da Unidade Curricular
*Programação Web Back-End I***, na qual os alunos aprenderam os
fundamentos de uma API, incluindo:

-   Estrutura básica de uma API
-   Organização em **rotas, controllers e models**
-   Comunicação entre **cliente e servidor**
-   Consumo de APIs

Na **Programação Web Back-End II**, os alunos evoluem esses
conhecimentos aplicando conceitos mais avançados e próximos do
desenvolvimento profissional de APIs.

------------------------------------------------------------------------

## Objetivos do Projeto

O objetivo principal deste projeto é permitir que os alunos:

-   Aprimorem a **lógica de programação**
-   Desenvolvam **APIs mais completas e seguras**
-   Trabalhem com **boas práticas de desenvolvimento back-end**
-   Entendam como publicar uma API em ambiente real

O projeto contém diversos **desafios práticos**, incentivando os alunos
a resolver problemas e desenvolver autonomia no desenvolvimento de
software.

------------------------------------------------------------------------

## Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias:

-   **Node.js**
-   **TypeScript**
-   **Express**
-   **JWT (JSON Web Token)**
-   **Multer**
-   **PostgreSQL**

------------------------------------------------------------------------

## Conceitos Trabalhados

Durante o desenvolvimento do projeto, os alunos irão trabalhar com os
seguintes conceitos:

### Autenticação

Implementação de autenticação utilizando **JWT (JSON Web Token)** para
proteger rotas da aplicação.

### Status Codes

Utilização correta de **HTTP Status Codes** para representar os
resultados das requisições da API.

Exemplos:

-   `200` -- Sucesso\
-   `201` -- Recurso criado\
-   `400` -- Erro de requisição\
-   `401` -- Não autorizado\
-   `404` -- Recurso não encontrado

### Validação de Dados

Validação de dados recebidos nas requisições para garantir a integridade
das informações da aplicação.

### Upload e Manipulação de Arquivos

Utilização da biblioteca **Multer** para realizar upload e manipulação
de arquivos enviados pelo cliente.

### Publicação da API

Os alunos também aprendem a realizar a **publicação da API**, podendo
executar o projeto em:

-   Ambiente **on-premise**
-   Ambiente de **nuvem**

------------------------------------------------------------------------

## Estrutura do Projeto

A aplicação segue uma organização simples para facilitar o aprendizado:

    src
     ├── controller
     ├── dto
     ├── middlewares
     ├── model
     ├── app.ts
     ├── routes.ts
     └── server.ts

-   **controller** → contém a lógica das requisições
-   **dto** → interface com estruturas para padronização das informações
-   **midlewares** → representa as configurações de serviços intermediários (Ex: upload de arquivos)
-   **model** → representa as entidades e interação com banco de dados
-   **app.ts** → inicializa o servidor web
-   **routes.ts** → centraliza todas as rotas da API
-   **server.ts** → configurações do servidor web

------------------------------------------------------------------------

## Desafios do Projeto

Este projeto foi desenvolvido com **diversos desafios intencionais**
para estimular o aprendizado dos alunos.

Alguns exemplos incluem:

-   Implementar validações adicionais
-   Criar novas rotas
-   Melhorar o tratamento de erros
-   Implementar novas funcionalidades

O objetivo é que os alunos **explorem o código, façam melhorias e
experimentem novas soluções**.

------------------------------------------------------------------------

## Público-Alvo

Este projeto foi desenvolvido para alunos do **ensino médio técnico**,
que já tiveram contato inicial com:

-   Lógica de programação
-   JavaScript/TypeScript
-   Conceitos básicos de API

------------------------------------------------------------------------

## Licença

Este projeto é destinado a **fins educacionais**.
