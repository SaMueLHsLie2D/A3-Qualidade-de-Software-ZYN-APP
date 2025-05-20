# Documentação da API

## Visão Geral
Esta documentação descreve todos os endpoints disponíveis na API, incluindo parâmetros, exemplos de requisição e resposta, autenticação e tratamento de erros.

## Base URL
```
http://localhost:3000/api
```

## Autenticação
A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, é necessário incluir o token no cabeçalho de autorização:

```
Authorization: Bearer {seu_token_jwt}
```

O token JWT é obtido através dos endpoints de login ou registro.

## Formato de Resposta
Todas as respostas seguem um formato padronizado:

### Sucesso
```json
{
  "status": "success",
  "message": "Mensagem de sucesso",
  "data": { ... } // Opcional, contém os dados da resposta
}
```

### Erro
```json
{
  "status": "error",
  "message": "Mensagem de erro",
  "errors": [ ... ] // Opcional, detalhes dos erros de validação
}
```

## Endpoints

### Usuários

#### Listar Usuários
```
GET /users
```

**Autenticação:** Requerida

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Limite de itens por página (padrão: 10)

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nome": "Nome do Usuário",
      "email": "email@exemplo.com"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Cadastro de Usuário
```
POST /users/register-full
```

**Autenticação:** Não requerida

**Corpo da Requisição:**
```json
{
  "nome": "Nome do Usuário",
  "email": "email@exemplo.com",
  "senha": "senha123",
  "peso": 70.5,
  "altura": 1.75,
  "gordura_corporal": 15.0,
  "faz_exercicio": true,
  "meta_perda_peso": 5.0
}
```

**Resposta de Sucesso (201):**
```json
{
  "status": "success",
  "message": "Usuário cadastrado com sucesso!",
  "data": {
    "usuario_id": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Resposta de Erro (400):**
```json
{
  "status": "error",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

#### Login de Usuário
```
POST /users/login
```

**Autenticação:** Não requerida

**Corpo da Requisição:**
```json
{
  "email": "email@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "nome": "Nome do Usuário",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Resposta de Erro (401):**
```json
{
  "status": "error",
  "message": "Email ou senha inválidos"
}
```

#### Solicitar Recuperação de Senha
```
POST /users/forgot-password
```

**Autenticação:** Não requerida

**Corpo da Requisição:**
```json
{
  "email": "email@exemplo.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.",
  "resetToken": "a1b2c3d4..." // Apenas para demonstração, em produção seria enviado por email
}
```

#### Redefinir Senha
```
POST /users/reset-password
```

**Autenticação:** Não requerida

**Corpo da Requisição:**
```json
{
  "token": "a1b2c3d4...",
  "senha": "novaSenha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Senha redefinida com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "status": "error",
  "message": "Token inválido ou expirado"
}
```

#### Deletar Usuário
```
DELETE /users/:id
```

**Autenticação:** Requerida

**Parâmetros de URL:**
- `id`: ID do usuário a ser deletado

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Usuário deletado com sucesso!"
}
```

**Resposta de Erro (403):**
```json
{
  "status": "error",
  "message": "Acesso negado"
}
```

### Registros de Saúde

#### Atualizar Registro Completo
```
PUT /registros-saude/update-full
```

**Autenticação:** Requerida

**Corpo da Requisição:**
```json
{
  "usuario_id": 1,
  "peso": 70.5,
  "altura": 1.75,
  "gordura_corporal": 15.0,
  "faz_exercicio": true,
  "meta_perda_peso": 5.0
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Registro de saúde atualizado com sucesso!"
}
```

#### Atualizar Peso
```
PUT /registros-saude/weight
```

**Autenticação:** Requerida

**Corpo da Requisição:**
```json
{
  "usuario_id": 1,
  "peso": 70.5
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Peso atualizado com sucesso!"
}
```

#### Atualizar Altura
```
PUT /registros-saude/height
```

**Autenticação:** Requerida

**Corpo da Requisição:**
```json
{
  "usuario_id": 1,
  "altura": 1.75
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Altura atualizada com sucesso!"
}
```

#### Atualizar Gordura Corporal
```
PUT /registros-saude/body-fat
```

**Autenticação:** Requerida

**Corpo da Requisição:**
```json
{
  "usuario_id": 1,
  "gordura_corporal": 15.0
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Gordura corporal atualizada com sucesso!"
}
```

#### Atualizar Exercício
```
PUT /registros-saude/exercise
```

**Autenticação:** Requerida

**Corpo da Requisição:**
```json
{
  "usuario_id": 1,
  "faz_exercicio": true
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Registro de exercício atualizado com sucesso!"
}
```

#### Atualizar Meta de Perda de Peso
```
PUT /registros-saude/weight-goal
```

**Autenticação:** Requerida

**Corpo da Requisição:**
```json
{
  "usuario_id": 1,
  "meta_perda_peso": 5.0
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Meta de perda de peso atualizada com sucesso!"
}
```

#### Obter Histórico de Métricas
```
GET /registros-saude/historico/:usuario_id
```

**Autenticação:** Requerida

**Parâmetros de URL:**
- `usuario_id`: ID do usuário

**Parâmetros de Query:**
- `tipo_metrica` (opcional): Filtrar por tipo de métrica ('peso', 'altura', 'gordura_corporal', 'meta_perda_peso')
- `data_inicio` (opcional): Filtrar por data de início (formato: 'YYYY-MM-DD')
- `data_fim` (opcional): Filtrar por data de fim (formato: 'YYYY-MM-DD')
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Limite de itens por página (padrão: 10)

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "usuario_id": 1,
      "tipo_metrica": "peso",
      "valor": 70.5,
      "data_registro": "2025-05-20T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Erro de validação ou requisição inválida
- `401 Unauthorized`: Autenticação necessária
- `403 Forbidden`: Acesso negado
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

## Tratamento de Erros

### Erros de Validação
Quando os dados enviados não passam na validação, a API retorna um status 400 com detalhes dos erros:

```json
{
  "status": "error",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "senha",
      "message": "Senha deve ter no mínimo 6 caracteres"
    }
  ]
}
```

### Erros de Autenticação
Quando o token JWT não é fornecido ou é inválido:

```json
{
  "status": "error",
  "message": "Acesso negado. Token não fornecido."
}
```

ou

```json
{
  "status": "error",
  "message": "Token inválido ou expirado."
}
```

### Erros de Permissão
Quando o usuário tenta acessar recursos de outro usuário:

```json
{
  "status": "error",
  "message": "Acesso negado"
}
```

### Erros de Recurso Não Encontrado
Quando o recurso solicitado não existe:

```json
{
  "status": "error",
  "message": "Registro de saúde não encontrado."
}
```

### Erros Internos do Servidor
Quando ocorre um erro interno:

```json
{
  "status": "error",
  "message": "Erro interno do servidor"
}
```
