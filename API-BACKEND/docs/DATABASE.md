# Documentação do Banco de Dados

## Visão Geral
Este documento descreve a estrutura do banco de dados MySQL utilizado pela aplicação, incluindo tabelas, campos, relacionamentos e exemplos de uso.

## Diagrama de Relacionamento

```
+---------------+       +------------------+       +--------------------+
|   usuarios    |       | registros_saude  |       | historico_metricas |
+---------------+       +------------------+       +--------------------+
| id (PK)       |       | id (PK)          |       | id (PK)            |
| nome          |       | usuario_id (FK)  |<----->| usuario_id (FK)    |
| email         |       | peso             |       | tipo_metrica       |
| senha         |       | altura           |       | valor              |
| reset_token   |       | gordura_corporal |       | data_registro      |
| reset_token_  |       | faz_exercicio    |       +--------------------+
|   expiry      |       | meta_perda_peso  |
| created_at    |       | created_at       |
| updated_at    |       | updated_at       |
+---------------+       +------------------+
```

## Tabelas

### usuarios

Armazena informações dos usuários do sistema.

#### Estrutura

| Campo             | Tipo          | Descrição                                      | Restrições                |
|-------------------|---------------|------------------------------------------------|---------------------------|
| id                | INT           | Identificador único do usuário                 | PK, AUTO_INCREMENT        |
| nome              | VARCHAR(100)  | Nome completo do usuário                       | NOT NULL                  |
| email             | VARCHAR(100)  | Endereço de email do usuário                   | NOT NULL, UNIQUE          |
| senha             | VARCHAR(255)  | Senha do usuário (hash bcrypt)                 | NOT NULL                  |
| reset_token       | VARCHAR(255)  | Token para recuperação de senha                | NULL                      |
| reset_token_expiry| DATETIME      | Data/hora de expiração do token de recuperação | NULL                      |
| created_at        | TIMESTAMP     | Data/hora de criação do registro               | DEFAULT CURRENT_TIMESTAMP |
| updated_at        | TIMESTAMP     | Data/hora da última atualização                | ON UPDATE CURRENT_TIMESTAMP |

#### Índices
- **Primário**: `id`
- **Único**: `email`

#### Exemplo de Inserção
```sql
INSERT INTO usuarios (nome, email, senha) 
VALUES ('João Silva', 'joao@exemplo.com', '$2b$10$X7EnEJC1LN/DYspAGnGYz.Rz4Y9O5q8xm3F2B2rX8ODk/3JcKJ5Vy');
```

#### Exemplo de Consulta
```sql
SELECT id, nome, email, created_at 
FROM usuarios 
WHERE email = 'joao@exemplo.com';
```

### registros_saude

Armazena os registros atuais de saúde dos usuários.

#### Estrutura

| Campo             | Tipo          | Descrição                                      | Restrições                |
|-------------------|---------------|------------------------------------------------|---------------------------|
| id                | INT           | Identificador único do registro                | PK, AUTO_INCREMENT        |
| usuario_id        | INT           | ID do usuário relacionado                      | FK, NOT NULL              |
| peso              | FLOAT         | Peso atual do usuário (kg)                     | NULL                      |
| altura            | FLOAT         | Altura do usuário (m)                          | NULL                      |
| gordura_corporal  | FLOAT         | Percentual de gordura corporal                 | NULL                      |
| faz_exercicio     | BOOLEAN       | Indica se o usuário pratica exercícios         | NULL                      |
| meta_perda_peso   | FLOAT         | Meta de perda de peso (kg)                     | NULL                      |
| created_at        | TIMESTAMP     | Data/hora de criação do registro               | DEFAULT CURRENT_TIMESTAMP |
| updated_at        | TIMESTAMP     | Data/hora da última atualização                | ON UPDATE CURRENT_TIMESTAMP |

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
SET peso = 74.2, updated_at = CURRENT_TIMESTAMP 
WHERE usuario_id = 1;
```

### historico_metricas

Armazena o histórico de todas as métricas de saúde dos usuários ao longo do tempo.

#### Estrutura

| Campo             | Tipo          | Descrição                                      | Restrições                |
|-------------------|---------------|------------------------------------------------|---------------------------|
| id                | INT           | Identificador único do registro                | PK, AUTO_INCREMENT        |
| usuario_id        | INT           | ID do usuário relacionado                      | FK, NOT NULL              |
| tipo_metrica      | ENUM          | Tipo de métrica ('peso', 'altura', 'gordura_corporal', 'meta_perda_peso') | NOT NULL |
| valor             | FLOAT         | Valor da métrica                               | NOT NULL                  |
| data_registro     | DATETIME      | Data/hora do registro da métrica               | NOT NULL                  |

#### Índices
- **Primário**: `id`
- **Estrangeiro**: `usuario_id` referencia `usuarios(id)` com CASCADE em DELETE
- **Composto**: `(usuario_id, tipo_metrica, data_registro)` para consultas eficientes

#### Exemplo de Inserção
```sql
INSERT INTO historico_metricas (usuario_id, tipo_metrica, valor, data_registro) 
VALUES (1, 'peso', 75.5, '2025-05-20 10:00:00');
```

#### Exemplo de Consulta
```sql
-- Consultar histórico de peso de um usuário nos últimos 30 dias
SELECT valor, data_registro 
FROM historico_metricas 
WHERE usuario_id = 1 
  AND tipo_metrica = 'peso' 
  AND data_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
ORDER BY data_registro DESC;
```

## Relacionamentos

### usuarios → registros_saude
- Tipo: Um para Um
- Chave Estrangeira: `registros_saude.usuario_id` referencia `usuarios.id`
- Comportamento: CASCADE em DELETE (quando um usuário é excluído, seu registro de saúde também é)

### usuarios → historico_metricas
- Tipo: Um para Muitos
- Chave Estrangeira: `historico_metricas.usuario_id` referencia `usuarios.id`
- Comportamento: CASCADE em DELETE (quando um usuário é excluído, todo seu histórico é excluído)

## Considerações de Desempenho

### Índices Recomendados
Para melhorar o desempenho em consultas frequentes, os seguintes índices são recomendados:

1. Índice em `historico_metricas(usuario_id, tipo_metrica, data_registro)` para consultas de histórico filtradas por tipo e período.
2. Índice em `usuarios(email)` para consultas de login e recuperação de senha.

### Consultas Otimizadas
Para consultas de histórico com grande volume de dados, recomenda-se:

```sql
-- Consulta otimizada para histórico com paginação
SELECT * FROM historico_metricas 
WHERE usuario_id = ? AND tipo_metrica = ? 
ORDER BY data_registro DESC 
LIMIT ? OFFSET ?;
```

## Scripts de Migração

### Criação Inicial do Banco de Dados
O script completo para criação das tabelas está disponível em `db/schema.sql`.

### Adição da Tabela de Histórico
O script para adicionar a tabela de histórico de métricas está disponível em `db/migrations/create_historico_metricas.sql`.

## Backup e Manutenção

### Backup Recomendado
Recomenda-se realizar backups diários do banco de dados completo, com atenção especial à tabela `historico_metricas` que tende a crescer mais rapidamente.

```sql
-- Exemplo de comando para backup
mysqldump -u [usuario] -p[senha] zyn_app_db > backup_$(date +%Y%m%d).sql
```

### Manutenção Periódica
Para manter o desempenho do banco de dados, recomenda-se:

1. Otimizar tabelas mensalmente:
```sql
OPTIMIZE TABLE usuarios, registros_saude, historico_metricas;
```

2. Analisar tabelas após grandes volumes de inserções:
```sql
ANALYZE TABLE historico_metricas;
```

## Exemplos de Uso Comuns

### Registro de Usuário com Métricas Iniciais
```sql
-- Transação para registro completo
START TRANSACTION;

-- Inserir usuário
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Maria Santos', 'maria@exemplo.com', '$2b$10$X7EnEJC1LN/DYspAGnGYz.Rz4Y9O5q8xm3F2B2rX8ODk/3JcKJ5Vy');

-- Obter ID do usuário inserido
SET @usuario_id = LAST_INSERT_ID();

-- Inserir registro de saúde
INSERT INTO registros_saude (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso) 
VALUES (@usuario_id, 65.0, 1.65, 22.0, true, 3.0);

-- Inserir no histórico
INSERT INTO historico_metricas (usuario_id, tipo_metrica, valor, data_registro)
VALUES 
  (@usuario_id, 'peso', 65.0, NOW()),
  (@usuario_id, 'altura', 1.65, NOW()),
  (@usuario_id, 'gordura_corporal', 22.0, NOW());

COMMIT;
```

### Atualização de Métrica com Registro no Histórico
```sql
-- Transação para atualização de peso
START TRANSACTION;

-- Atualizar registro atual
UPDATE registros_saude 
SET peso = 64.5 
WHERE usuario_id = 1;

-- Registrar no histórico
INSERT INTO historico_metricas (usuario_id, tipo_metrica, valor, data_registro)
VALUES (1, 'peso', 64.5, NOW());

COMMIT;
```

### Consulta de Progresso ao Longo do Tempo
```sql
-- Consultar progresso de peso nos últimos 3 meses
SELECT 
  DATE_FORMAT(data_registro, '%Y-%m-%d') AS data,
  valor
FROM historico_metricas 
WHERE usuario_id = 1 
  AND tipo_metrica = 'peso' 
  AND data_registro >= DATE_SUB(NOW(), INTERVAL 3 MONTH) 
ORDER BY data_registro;
```
