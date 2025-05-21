# Documentação do Banco de Dados

## Visão Geral

Este documento descreve a estrutura do banco de dados MySQL utilizado pela aplicação ZYN, incluindo tabelas, campos, relacionamentos e exemplos de uso.

## Diagrama de Relacionamento

```
+---------------+       +------------------+
|   usuarios    |       | registros_saude  |
+---------------+       +------------------+
| id (PK)       |       | id (PK)          |
| nome          |       | usuario_id (FK)  |
| email         |       | peso             |
| senha         |       | altura           |
| created_at    |       | gordura_corporal |
| updated_at    |       | imc (GENERATED)  |
+---------------+       | faz_exercicio    |
                        | meta_perda_peso  |
                        | data_registro    |
                        +------------------+
```

## Tabelas

### usuarios

Armazena informações dos usuários do sistema.

#### Estrutura

| Campo | Tipo         | Descrição                      | Restrições         |
| ----- | ------------ | ------------------------------ | ------------------ |
| id    | INT          | Identificador único do usuário | PK, AUTO_INCREMENT |
| nome  | VARCHAR(100) | Nome completo do usuário       | NOT NULL           |
| email | VARCHAR(100) | Endereço de email do usuário   | NOT NULL, UNIQUE   |
| senha | VARCHAR(255) | Senha do usuário (hash bcrypt) | NOT NULL           |

#### Índices

- **Primário**: `id`
- **Único**: `email`

#### Exemplo de Inserção

```sql
-- A senha é armazenada como hash bcrypt
INSERT INTO usuarios (nome, email, senha)
VALUES ('João Silva', 'joao@exemplo.com', '$2b$10$X7EnEJC1LN/DYspAGnGYz.Rz4Y9O5q8xm3F2B2rX8ODk/3JcKJ5Vy');
```

#### Exemplo de Consulta

```sql
SELECT id, nome, email
FROM usuarios
WHERE email = 'joao@exemplo.com';
```

### registros_saude

Armazena os registros de saúde dos usuários.

#### Estrutura

| Campo            | Tipo         | Descrição                              | Restrições                                             |
| ---------------- | ------------ | -------------------------------------- | ------------------------------------------------------ |
| id               | INT          | Identificador único do registro        | PK, AUTO_INCREMENT                                     |
| usuario_id       | INT          | ID do usuário relacionado              | FK, NOT NULL                                           |
| peso             | DECIMAL(5,2) | Peso atual do usuário (kg)             | NOT NULL                                               |
| altura           | DECIMAL(4,2) | Altura do usuário (m)                  | NOT NULL                                               |
| gordura_corporal | DECIMAL(5,2) | Percentual de gordura corporal         | NULL                                                   |
| imc              | DECIMAL(5,2) | Índice de Massa Corporal               | GENERATED ALWAYS AS (peso / (altura \* altura)) STORED |
| faz_exercicio    | BOOLEAN      | Indica se o usuário pratica exercícios | DEFAULT FALSE                                          |
| meta_perda_peso  | DECIMAL(5,2) | Meta de perda de peso (kg)             | NULL                                                   |
| data_registro    | DATETIME     | Data/hora de criação do registro       | DEFAULT CURRENT_TIMESTAMP                              |

#### Índices

- **Primário**: `id`
- **Estrangeiro**: `usuario_id` referencia `usuarios(id)` com CASCADE em DELETE

#### Exemplo de Inserção

```sql
INSERT INTO registros_saude (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
VALUES (1, 75.5, 1.80, 18.5, true, 5.0);
```

#### Exemplo de Atualização

```sql
UPDATE registros_saude
SET peso = 74.2
WHERE usuario_id = 1;
```

## Relacionamentos

### usuarios → registros_saude

- Tipo: Um para Um
- Chave Estrangeira: `registros_saude.usuario_id` referencia `usuarios.id`
- Comportamento: CASCADE em DELETE (quando um usuário é excluído, seu registro de saúde também é)

## Configuração do Banco de Dados

A conexão com o banco de dados é configurada através de variáveis de ambiente:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=zyn_app_db
DB_PORT=3306
```

## Scripts SQL

### Criação das Tabelas

```sql
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

-- Tabela de registros de saúde
CREATE TABLE IF NOT EXISTS registros_saude (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  altura DECIMAL(4,2) NOT NULL,
  gordura_corporal DECIMAL(5,2),
  imc DECIMAL(5,2) GENERATED ALWAYS AS (peso / (altura * altura)) STORED,
  faz_exercicio BOOLEAN DEFAULT FALSE,
  meta_perda_peso DECIMAL(5,2),
  data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

## Características Especiais

### Cálculo Automático do IMC

O IMC (Índice de Massa Corporal) é calculado automaticamente pelo banco de dados como uma coluna gerada, utilizando a fórmula: `peso / (altura * altura)`. Isso significa que:

1. Não é necessário calcular o IMC na aplicação
2. O IMC é sempre atualizado automaticamente quando peso ou altura são alterados
3. Não é possível inserir ou atualizar diretamente o valor do IMC

Exemplo de consulta que inclui o IMC:

```sql
SELECT usuario_id, peso, altura, imc
FROM registros_saude
WHERE usuario_id = 1;
```

## Backup e Manutenção

### Backup Recomendado

Recomenda-se realizar backups periódicos do banco de dados:

```bash
# Exemplo de comando para backup
mysqldump -u [usuario] -p[senha] zyn_app_db > backup_$(date +%Y%m%d).sql
```

### Manutenção Periódica

Para manter o desempenho do banco de dados, recomenda-se:

1. Otimizar tabelas periodicamente:

```sql
OPTIMIZE TABLE usuarios, registros_saude;
```

2. Analisar tabelas após grandes volumes de inserções:

```sql
ANALYZE TABLE usuarios, registros_saude;
```

## Exemplos de Uso Comuns

### Registro de Usuário com Métricas Iniciais

```sql
-- Transação para registro completo
START TRANSACTION;

-- Inserir usuário (a senha já deve estar com hash)
INSERT INTO usuarios (nome, email, senha)
VALUES ('Maria Santos', 'maria@exemplo.com', '$2b$10$X7EnEJC1LN/DYspAGnGYz.Rz4Y9O5q8xm3F2B2rX8ODk/3JcKJ5Vy');

-- Obter ID do usuário inserido
SET @usuario_id = LAST_INSERT_ID();

-- Inserir registro de saúde
INSERT INTO registros_saude (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
VALUES (@usuario_id, 65.0, 1.65, 22.0, true, 3.0);

COMMIT;
```

### Consulta de Usuários com Dados de Saúde

```sql
SELECT u.id, u.nome, u.email, r.peso, r.altura, r.imc, r.gordura_corporal, r.faz_exercicio, r.meta_perda_peso
FROM usuarios u
JOIN registros_saude r ON u.id = r.usuario_id
WHERE u.id = 1;
```

## Considerações de Segurança

1. Todas as senhas são armazenadas utilizando hash bcrypt
2. As credenciais do banco de dados são armazenadas em variáveis de ambiente
3. Transações são utilizadas para operações que afetam múltiplas tabelas
4. Validações são implementadas tanto no backend quanto no banco de dados
