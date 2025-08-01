# 🔐 Guia Rápido de Endpoints (Backend)
## 1. Autenticação
#### Criar Usuário (POST)
* Content-Type: application/json

http://localhost:3001/users

Modelo:
{
    "email": "admin@teste.com",
    "password": "123456",
    "name": "teste"
}

### Login (GET Token JWT)

* Pegar o token  para entrar nas rotas privadas
http://localhost:3001/auth/login 

{
    "email": "teste@teste.com",
    "password": "123456"
}

* Dica: Use o token retornado no header Authorization: Bearer <token>

## 2. Máquinas 

### Criação de máquina (POST)

http://localhost:3001/machines



{
  "name": "Máquina de Teste 2",
  "type": "pump"
}


### Atualizar Máquina (PATCH)

* PATCH /machines/:id
* Authorization: Bearer <token>
* Content-Type: application/json

{
    "name": "teste atualização de máquina"
}

## Pontos de Monitoramento 

http://localhost:3001/monitoring-points

### Criar Ponto (POST)

* Modelo para criação de ponto de monitoramento

{
  "machineName": "Máquina de Teste 2",
  "name": "Ponto 1",
  "sensor": {
    "model": "HF+"
  }
}

## Regras de Negócio:

* Sensores TcAg e TcAs não só podem ser associados a máquinas do tipo pump
