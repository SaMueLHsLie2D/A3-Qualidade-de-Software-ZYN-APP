// Script para criar as tabelas necessárias para o sistema
// Incluindo a nova tabela de histórico de métricas e campos para recuperação de senha

// Tabela de usuários com campos para recuperação de senha
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

// Tabela de registros de saúde
CREATE TABLE IF NOT EXISTS registros_saude (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  peso FLOAT,
  altura FLOAT,
  gordura_corporal FLOAT,
  faz_exercicio BOOLEAN,
  meta_perda_peso FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

// Tabela para histórico de métricas
CREATE TABLE IF NOT EXISTS historico_metricas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_metrica ENUM('peso', 'altura', 'gordura_corporal', 'meta_perda_peso') NOT NULL,
  valor FLOAT NOT NULL,
  data_registro DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
