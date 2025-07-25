#Projeto Full-Stack | Desafio de Gerenciamento de Máquinas
##Descrição do Projeto
Este projeto é uma aplicação full-stack desenvolvida para gerenciar máquinas industriais, seus pontos de monitoramento e sensores. Ele demonstra a implementação de um sistema de CRUD (criar, ler, atualizar, deletar) robusto e uma lógica de negócio específica para garantir a integridade dos dados. A arquitetura utiliza Next.js para o front-end, com gerenciamento de estado centralizado pelo Redux Toolkit.

---

## Funcionalidades
* ✅ **Autenticação de Usuário:** Fluxo de login e logout com rotas protegidas pelo Redux.
* 🚧 **Gerenciamento de Máquinas:** Crie, edite e exclua máquinas com nome e tipo (ex: "Pump", "Fan").
* 🚧 **Gerenciamento de Pontos de Monitoramento:** Associe pontos de monitoramento e sensores a máquinas existentes, respeitando regras de negócio.
* 🚧 **Visualização de Dados:** Lista paginada de pontos de monitoramento, exibindo 5 itens por página.
* 🚧 **Ordenação:** Capacidade de ordenar a lista por qualquer coluna (nome da máquina, tipo, etc.).

---

Tecnologias Utilizadas
Front-end: Next.js, React, TypeScript, Redux Toolkit, Material UI (MUI).

---

##Análise Técnica

1. Estrutura do Projeto (Monorepo)
O projeto é organizado como um monorepo, com as pastas front e, futuramente, back na raiz do repositório. Essa estrutura permite o gerenciamento de ambos os projetos em um único lugar, facilitando a organização e a colaboração.

2. Gerenciamento de Estado (Redux Toolkit)
A arquitetura do front-end é baseada no Redux Toolkit. O estado da aplicação (incluindo autenticação e, futuramente, máquinas e pontos de monitoramento) é gerenciado de forma centralizada em uma única fonte de verdade. A migração do Context API para o Redux está concluída, resultando em um código mais previsível e de fácil manutenção.

---

##Instalação e Execução

1. Clonar o Repositório

```Bash
git clone [https://github.com/SabrinaMiyamoto/developer-challenges](https://github.com/SabrinaMiyamoto/developer-challenges)
cd developer-challenges

##2. Instalar as Dependências

```Bash

cd front
npm install

###3. Executar o Projeto
```Bash

npm run dev