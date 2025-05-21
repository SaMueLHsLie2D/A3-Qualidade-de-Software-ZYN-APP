# Documentação da API

## Visão Geral

A API ZYN fornece endpoints para gerenciar usuários e seus registros de saúde. A aplicação permite cadastrar usuários, autenticar, gerenciar perfis e atualizar métricas de saúde como peso, altura, gordura corporal, exercícios e metas de perda de peso.

O IMC (Índice de Massa Corporal) é calculado automaticamente pelo banco de dados com base no peso e altura do usuário.

## Base URL

```
http://localhost:3000
```

## Autenticação

A autenticação é realizada através do endpoint de login, que retorna o ID e nome do usuário para uso em requisições subsequentes. Todas as senhas são armazenadas com hash bcrypt para garantir a segurança dos dados.

**Nota:** É recomendado implementar um sistema de autenticação baseado em tokens JWT para maior segurança.

## Configuração

A API utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=zyn_app_db
DB_PORT=3306
PORT=3000
```

## Instalação e Execução

### Pré-requisitos

- Node.js (v14 ou superior)
- MySQL (v8 ou superior)

### Passos para instalação

1. Clone o repositório

```bash
git clone https://github.com/SaMueLHsLie2D/A3-Qualidade-de-Software-ZYN-APP
cd A3-Qualidade-de-Software-ZYN-APP
```

2. Instale as dependências

```bash
npm install
```

3. Configure o arquivo .env conforme instruções acima

4. Crie o banco de dados

```sql
CREATE DATABASE zyn_app_db;
```

5. Execute os scripts SQL para criar as tabelas (disponíveis na documentação do banco de dados)

6. Inicie o servidor

```bash
npm start
```

7. Para executar os testes

```bash
npm test
```

## Endpoints

### Usuários

#### Listar Todos os Usuários

Retorna uma lista de todos os usuários cadastrados.

- **URL**: `/api/users`
- **Método**: `GET`
- **Autenticação**: Não requerida (recomendado implementar)

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
  "erro": "Erro ao listar usuários"
}
```

#### Cadastrar Usuário com Dados de Saúde

Cadastra um novo usuário com seus dados iniciais de saúde. A senha é armazenada com hash bcrypt.

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

**Campos obrigatórios**: nome, email, senha, peso, altura

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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "Todos os campos obrigatórios devem ser preenchidos"
}
```

ou

```json
{
  "erro": "Email já cadastrado"
}
```

- **Código**: 500 Internal Server Error
- **Conteúdo**:

```json
{
  "erro": "Erro ao cadastrar usuário"
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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "Email e senha são obrigatórios"
}
```

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
  "erro": "Erro ao fazer login"
}
```

#### Deletar Usuário

Remove um usuário do sistema.

- **URL**: `/api/users/:id`
- **Método**: `DELETE`
- **Autenticação**: Requerida (recomendado implementar JWT)
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
  "erro": "Erro ao deletar usuário"
}
```

### Registros de Saúde

#### Atualizar Registro de Saúde Completo

Atualiza todos os dados de saúde de um usuário.

- **URL**: `/api/registros-saude/update-full`
- **Método**: `PUT`
- **Autenticação**: Requerida (recomendado implementar JWT)
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

**Campos obrigatórios**: usuario_id, peso, altura

**Resposta de Sucesso**:

- **Código**: 200 OK
- **Conteúdo**:

```json
{
  "mensagem": "Registro de saúde atualizado com sucesso!"
}
```

**Resposta de Erro**:

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "Todos os campos obrigatórios devem ser preenchidos"
}
```

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
  "erro": "Erro ao atualizar registro de saúde"
}
```

#### Atualizar Peso

Atualiza apenas o peso do usuário.

- **URL**: `/api/registros-saude/weight`
- **Método**: `PUT`
- **Autenticação**: Requerida (recomendado implementar JWT)
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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "ID do usuário e peso são obrigatórios"
}
```

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
  "erro": "Erro ao atualizar peso"
}
```

#### Atualizar Altura

Atualiza apenas a altura do usuário.

- **URL**: `/api/registros-saude/height`
- **Método**: `PUT`
- **Autenticação**: Requerida (recomendado implementar JWT)
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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "ID do usuário e altura são obrigatórios"
}
```

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
  "erro": "Erro ao atualizar altura"
}
```

#### Atualizar Gordura Corporal

Atualiza apenas o percentual de gordura corporal do usuário.

- **URL**: `/api/registros-saude/body-fat`
- **Método**: `PUT`
- **Autenticação**: Requerida (recomendado implementar JWT)
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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "ID do usuário e gordura corporal são obrigatórios"
}
```

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
  "erro": "Erro ao atualizar gordura corporal"
}
```

#### Atualizar Status de Exercício

Atualiza o status de prática de exercícios do usuário.

- **URL**: `/api/registros-saude/exercise`
- **Método**: `PUT`
- **Autenticação**: Requerida (recomendado implementar JWT)
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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "ID do usuário e status de exercício são obrigatórios"
}
```

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
  "erro": "Erro ao atualizar status de exercício"
}
```

#### Atualizar Meta de Perda de Peso

Atualiza a meta de perda de peso do usuário.

- **URL**: `/api/registros-saude/weight-goal`
- **Método**: `PUT`
- **Autenticação**: Requerida (recomendado implementar JWT)
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

- **Código**: 400 Bad Request
- **Conteúdo**:

```json
{
  "erro": "ID do usuário e meta de perda de peso são obrigatórios"
}
```

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
  "erro": "Erro ao atualizar meta de perda de peso"
}
```

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

## Tratamento de Erros

A API utiliza códigos de status HTTP padrão para indicar o resultado das requisições:

- 200: Sucesso
- 201: Recurso criado com sucesso
- 400: Requisição inválida (dados incorretos ou incompletos)
- 401: Não autorizado (credenciais inválidas)
- 404: Recurso não encontrado
- 500: Erro interno do servidor

## Considerações sobre o Banco de Dados

O IMC (Índice de Massa Corporal) é calculado automaticamente pelo banco de dados como uma coluna gerada, utilizando a fórmula: peso / (altura \* altura).

Para mais detalhes sobre a estrutura do banco de dados, consulte a documentação específica do banco de dados.
