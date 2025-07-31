# Projeto Full-Stack | Desafio de Gerenciamento de Máquinas
## Descrição do Projeto
Este projeto é uma aplicação full-stack desenvolvida para gerenciar máquinas industriais, seus pontos de monitoramento e sensores. Ele demonstra a implementação de um sistema de CRUD (criar, ler, atualizar, deletar) robusto e uma lógica de negócio específica para garantir a integridade dos dados. A arquitetura utiliza Next.js para o front-end, com gerenciamento de estado centralizado pelo Redux Toolkit.

---

## Funcionalidades
* ✅ **Autenticação de Usuário:** Fluxo de login e logout com rotas protegidas pelo Redux.
* ✅ **Gerenciamento de Máquinas:** Crie, edite e exclua máquinas com nome e tipo (ex: "Pump", "Fan").
* ✅ **Gerenciamento de Pontos de Monitoramento:** Associe pontos de monitoramento e sensores a máquinas existentes, respeitando regras de negócio.
* ✅ **Visualização de Dados:** Lista paginada de pontos de monitoramento, exibindo 5 itens por página.
* ✅ **Ordenação:** Capacidade de ordenar a lista por qualquer coluna (nome da máquina, tipo, etc.).
* ✅ **Visualização de Dados:** Lista paginada de pontos de monitoramento, exibindo 5 itens por página.

---

## Tecnologias Utilizadas
Front-end: Next.js, React, TypeScript, Redux Toolkit, Material UI (MUI).

---

## Análise Técnica

1. Estrutura do Projeto (Monorepo)
O projeto é organizado como um monorepo, com as pastas front e back na raiz do repositório. Essa estrutura permite o gerenciamento de ambos os projetos em um único lugar, facilitando a organização e a colaboração.

2. Gerenciamento de Estado (Redux Toolkit)
A arquitetura do front-end é baseada no Redux Toolkit. O estado da aplicação incluindo autenticação, máquinas e pontos de monitoramento é gerenciado de forma centralizada em uma única fonte de verdade. A migração do Context API para o Redux está concluída, resultando em um código mais previsível e de fácil manutenção.

3.Implementação de CRUD de Máquinas
As operações de Criação, Leitura, Atualização e Exclusão (CRUD) de máquinas foram implementadas de forma funcional:

- Leitura (Listagem): Máquinas são carregadas e exibidas em uma lista, com opção de filtragem por tipo.

- Criação: Uma funcionalidade para adicionar novas máquinas foi desenvolvida.

- Edição: É possível selecionar uma máquina na lista para editar seu nome e tipo através de um modal dedicado.

- Exclusão: Máquinas podem ser removidas da lista, com confirmação e feedback ao usuário.

4. Imutabilidade dos Dados

Para garantir a integridade e previsibilidade do estado, todas as operações que modificam a lista de máquinas (adição, atualização, exclusão) foram implementadas de forma imutável. Isso significa que, em vez de alterar o array de máquinas existente, um novo array é sempre gerado com as modificações, e a variável de estado é atualizada para apontar para essa nova cópia. Essa abordagem previne efeitos colaterais e otimiza a detecção de mudanças pelo React e Redux.

4.1. Ordenação da Lista de Pontos de Monitoramento
Implementamos a funcionalidade de ordenação ascendente e descendente para qualquer coluna da lista de pontos de monitoramento, melhorando a usabilidade e análise dos dados. O estado de ordenação é controlado via Redux, garantindo atualização eficiente da interface.

5.Tratamento de Erros e Feedback Visual
A aplicação inclui feedback visual para o usuário durante operações assíncronas (como carregamento e exclusão) e notificações de sucesso/erro via Snackbar. Erros da API são capturados e logados no console para facilitar a depuração, mantendo a interface do usuário limpa.

6. Temos duas peças importantes para organizar os dados dos sensores no sistema:

- SensorModel (A Lista de Tipos de Sensores):

  - O que é: É como uma lista predefinida dos "tipos de sensor" que o sistema conhece (por exemplo, "Termopar AG", "Termopar AS", "Alta Frequência").
  - Para que serve: Garante que só use tipos de sensor válidos, evitando erros e deixando o código mais claro sobre qual sensor está sendo usado.

- ISensor (A Identidade de Cada Sensor):

  - O que é: Define exatamente as informações que cada sensor individual deve ter (um ID único, qual é o SensorModel, e opcionalmente uma imagem).

  - Para que serve: Assegura que todos os seus objetos de sensor sigam o mesmo padrão, tornando os dados consistentes.

  7.Implementação dos Modais para edição e exclusão dos pontos de monitoramento.

  - Já implementada a regra de negócio que restringe o uso de sensores do tipo HF+ apenas para máquinas do tipo Pump.

  - Inclusão do campo Data de Criação do ponto de monitoramento para registro histórico.

  - Inclusão do campo Data da Última Manutenção, que é opcional, permitindo controle adicional das manutenções realizadas.

---

## Instalação e Execução

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

npm run dev ```