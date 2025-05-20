Para iniciar a api execute o comando "node app.js" no terminal.

-Bancos e Tabelas-

--Nome do Banco/Schemas

zyn_app_db

-- Tabela de usuários

CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR(255) NOT NULL
);

-- Tabela registros_saude

CREATE TABLE registros_saude (
id INT AUTO_INCREMENT PRIMARY KEY,
usuario_id INT NOT NULL,
peso DECIMAL(5,2) NOT NULL,
altura DECIMAL(4,2) NOT NULL,
gordura_corporal DECIMAL(5,2),
imc DECIMAL(5,2) GENERATED ALWAYS AS (peso / (altura \* altura)) STORED,
faz_exercicio BOOLEAN DEFAULT FALSE,
meta_perda_peso DECIMAL(5,2),
data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

\*a aplicação nn precisa calcular o imc o banco já conseque fazer isso.(Aprendi isso ontem então já implementei)
