# Projeto Full-Stack | Desafio de Gerenciamento de Máquinas

## Descrição do Projeto
O backend desta aplicação fornece a API para o sistema de gerenciamento de máquinas industriais, com endpoints para autenticação, CRUD de máquinas e pontos de monitoramento, seguindo regras de negócio específicas.

---

## Funcionalidades

✅ Autenticação de Usuário: Login e logout com JWT

✅ CRUD de Máquinas: Crie, liste, atualize e delete máquinas

✅ Pontos de Monitoramento: Associe sensores a máquinas com validações

✅ Regras de Negócio: Validação de tipos de sensores (ex: HF+ só em Pumps)

✅ Paginação e Ordenação: Listagens com suporte a paginação


## Tecnologias Utilizadas

- Node.js (Runtime JavaScript)

- NestJS (Framework para construção eficiente de APIs)

- JWT (Autenticação por tokens)

- MongoDB (Atlas)

- Mongoose


## Instalação e Execução


1. Clonar o Repositório

```Bash
git clone [https://github.com/SabrinaMiyamoto/developer-challenges](https://github.com/SabrinaMiyamoto/developer-challenges)
cd developer-challenges

##2. Instalar as Dependências

```Bash

cd back
npm install

###3. Executar o Projeto
```Bash

npm run start```