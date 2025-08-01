# 🏭  Sistema de Gerenciamento de Máquinas

![Status Frontend](https://img.shields.io/badge/Frontend-Completo-success)
![Status Backend](https://img.shields.io/badge/Backend-Completo-success)
![Banco de Dados](https://img.shields.io/badge/MongoDB-Atlas-green)
![Integração](https://img.shields.io/badge/Status-Não_Integrado-important)

## Descrição do Projeto

Este projeto é uma aplicação full-stack desenvolvida para gerenciar máquinas industriais, seus pontos de monitoramento e sensores. Ele demonstra a implementação de um sistema de CRUD (criar, ler, atualizar, deletar) robusto e uma lógica de negócio específica para garantir a integridade dos dados. A arquitetura utiliza Next.js para o front-end, com gerenciamento de estado centralizado pelo Redux Toolkit.


## 📌 Visão Geral
Solução full-stack para gestão de:

* Máquinas industriais

* Pontos de monitoramento

* Sensores com regras de negócio validadas



## 🛠 Tecnologias  

| **Frontend**              | **Backend**               |
|---------------------------|---------------------------|
| • Next.js                 | • NestJS                  |
| • TypeScript              | • MongoDB Atlas           |
| • Redux Toolkit           | • Mongoose (ODM)          |
| • Material UI             | • JWT Authentication      |

## 🔍 Detalhes Técnicos

### Frontend
* Mock API: Funcionalidade completa sem dependência do backend

* Gerenciamento de Estado: Com Redux Toolkit


### Backend

* Database: Modelos com validação via Mongoose

* Autenticação: JWT com estratégia 

## 📌 Decisões de Arquitetura

### Separação intencional entre frontend/backend para:

* Demonstração independente de cada módulo

* Facilidade de teste isolado

### Pronto para integração:

* Interfaces compatíveis (DTOs alinhados)

* CORS configurado no backend


## 🚀 Instalação e Execução


### 1. Clonar o Repositório

```Bash
git clone https://github.com/SabrinaMiyamoto/developer-challenges.git 
cd developer-challenges
```

### 2. Configurar ambientes

### Front-end

```Bash

cd front
npm install
cp .env.example .env.local #Configurar variáveis se necessário

```
### Back-end
```Bash
cd back
npm install
cp .env.example .env #Inserir URI do MongoDb Atlas

```

### 3. Executar o Projeto

### Em terminais separados:

### Terminal 1 - Front-end
```Bash

npm run dev
 ```
### Terminal 2 - Back-end

 ```Bash
 npm run start