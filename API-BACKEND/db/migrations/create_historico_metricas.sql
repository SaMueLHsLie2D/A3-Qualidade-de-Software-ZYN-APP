-- Criar tabela para histórico de métricas
CREATE TABLE IF NOT EXISTS historico_metricas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_metrica ENUM('peso', 'altura', 'gordura_corporal', 'meta_perda_peso') NOT NULL,
  valor FLOAT NOT NULL,
  data_registro DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
