# Documentação da API ZYN

## Visão Geral

Esta API fornece endpoints para gerenciar usuários e seus registros de saúde para o aplicativo ZYN. A API permite cadastrar usuários, autenticar, gerenciar perfis e atualizar métricas de saúde como peso, altura, gordura corporal, exercícios e metas de perda de peso.

## Base URL

```
http://localhost:3000
```

## Autenticação

A autenticação é realizada através do endpoint de login, que retorna o ID e nome do usuário para uso em requisições subsequentes.

## Endpoints

### Usuários

#### Listar Todos os Usuários

Retorna uma lista de todos os usuários cadastrados.

- **URL**: `/api/users`
- **Método**: `GET`
- **Autenticação**: Não requerida

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com"
  },
  {
    "id": 2,
    "nome": "Maria Souza",
    "email": "maria@exemplo.com"
  }
]
```

**Resposta de Erro**:

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Cadastrar Usuário com Dados de Saúde

Cadastra um novo usuário com seus dados iniciais de saúde.

- **URL**: `/api/users/register-full`
- **Método**: `POST`
- **Autenticação**: Não requerida
- **Corpo da Requisição**:

```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "senha123",
  "peso": 75.5,
  "altura": 1.75,
  "gordura_corporal": 18,
  "faz_exercicio": true,
  "meta_perda_peso": 5
}
```

**Resposta de Sucesso**:

- **Código**: 201 Created
- **Conteúdo**:

```json
{
  "mensagem": "Usuário cadastrado com sucesso!",
  "usuario_id": 1
}
```

**Resposta de Erro**:

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Login de Usuário

Autentica um usuário e retorna seu ID e nome.

- **URL**: `/api/users/login`
- **Método**: `POST`
- **Autenticação**: Não requerida
- **Corpo da Requisição**:

```json
{
  "email": "joao@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "id": 1,
  "nome": "João Silva"
}
```

**Resposta de Erro**:

- **Código**: 401 Unauthorized
- **Conteúdo**:

```json
{
  "erro": "Email ou senha inválidos"
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Deletar Usuário

Remove um usuário do sistema.

- **URL**: `/api/users/:id`
- **Método**: `DELETE`
- **Autenticação**: Não especificada (recomendado implementar)
- **Parâmetros de URL**:
  - `id`: ID do usuário a ser removido

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Usuário deletado com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "erro": "Usuário não encontrado"
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

### Registros de Saúde

#### Atualizar Registro de Saúde Completo

Atualiza todos os dados de saúde de um usuário.

- **URL**: `/api/registros-saude/update-full`
- **Método**: `PUT`
- **Autenticação**: Não especificada (recomendado implementar)
- **Corpo da Requisição**:

```json
{
  "usuario_id": 1,
  "peso": 73.5,
  "altura": 1.75,
  "gordura_corporal": 16,
  "faz_exercicio": true,
  "meta_perda_peso": 3
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde atualizado com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde não encontrado."
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Atualizar Peso

Atualiza apenas o peso do usuário.

- **URL**: `/api/registros-saude/weight`
- **Método**: `PUT`
- **Autenticação**: Não especificada (recomendado implementar)
- **Corpo da Requisição**:

```json
{
  "usuario_id": 1,
  "peso": 72.5
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Peso atualizado com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde não encontrado."
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Atualizar Altura

Atualiza apenas a altura do usuário.

- **URL**: `/api/registros-saude/height`
- **Método**: `PUT`
- **Autenticação**: Não especificada (recomendado implementar)
- **Corpo da Requisição**:

```json
{
  "usuario_id": 1,
  "altura": 1.76
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Altura atualizada com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde não encontrado."
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Atualizar Gordura Corporal

Atualiza apenas o percentual de gordura corporal do usuário.

- **URL**: `/api/registros-saude/body-fat`
- **Método**: `PUT`
- **Autenticação**: Não especificada (recomendado implementar)
- **Corpo da Requisição**:

```json
{
  "usuario_id": 1,
  "gordura_corporal": 15
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Gordura corporal atualizada com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde não encontrado."
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Atualizar Status de Exercício

Atualiza o status de prática de exercícios do usuário.

- **URL**: `/api/registros-saude/exercise`
- **Método**: `PUT`
- **Autenticação**: Não especificada (recomendado implementar)
- **Corpo da Requisição**:

```json
{
  "usuario_id": 1,
  "faz_exercicio": true
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Registro de exercício atualizado com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde não encontrado."
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

#### Atualizar Meta de Perda de Peso

Atualiza a meta de perda de peso do usuário.

- **URL**: `/api/registros-saude/weight-goal`
- **Método**: `PUT`
- **Autenticação**: Não especificada (recomendado implementar)
- **Corpo da Requisição**:

```json
{
  "usuario_id": 1,
  "meta_perda_peso": 4
}
```

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Meta de perda de peso atualizada com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 404 Not Found
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde não encontrado."
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Mensagem de erro"
}
```

## Estrutura do Banco de Dados

A API utiliza um banco de dados MySQL com as seguintes tabelas:

### Tabela `usuarios`

- `id`: INT (Chave primária, Auto incremento)
- `nome`: VARCHAR
- `email`: VARCHAR
- `senha`: VARCHAR

### Tabela `registros_saude`

- `id`: INT (Chave primária, Auto incremento)
- `usuario_id`: INT (Chave estrangeira para usuarios.id)
- `peso`: FLOAT
- `altura`: FLOAT
- `gordura_corporal`: FLOAT
- `faz_exercicio`: BOOLEAN
- `meta_perda_peso`: FLOAT

## Exemplos de Uso

### Cadastrar um novo usuário com dados de saúde

```bash
curl -X POST http://localhost:3000/api/users/register-full \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "senha": "senha123",
    "peso": 75.5,
    "altura": 1.75,
    "gordura_corporal": 18,
    "faz_exercicio": true,
    "meta_perda_peso": 5
  }'
```

### Login de usuário

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "senha123"
  }'
```

### Atualizar peso do usuário

```bash
curl -X PUT http://localhost:3000/api/registros-saude/weight \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "peso": 72.5
  }'
```
