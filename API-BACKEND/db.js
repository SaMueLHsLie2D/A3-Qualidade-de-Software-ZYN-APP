/**
 * Configuração e gerenciamento da conexão com o banco de dados MySQL
 * 
 * Este módulo configura e exporta uma pool de conexões MySQL para uso em toda a aplicação.
 * Utiliza variáveis de ambiente para configuração e implementa um mecanismo de teste de conexão.
 * 
 * @module db
 */

const mysql = require('mysql2');
require('dotenv').config();

/**
 * Cria uma pool de conexões MySQL com base nas configurações do arquivo .env
 * 
 * A pool de conexões permite o reuso eficiente de conexões e gerencia automaticamente
 * a criação e liberação de conexões conforme necessário.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Testa a conexão com o banco de dados e libera a conexão após o teste
 * 
 * Esta função é executada na inicialização para verificar se a conexão
 * com o banco de dados está funcionando corretamente.
 */
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
  connection.release();
});

/**
 * Função para encerrar a pool de conexões
 * 
 * Esta função é chamada quando a aplicação for encerrada
 * para garantir que todas as conexões sejam fechadas corretamente.
 */
const closePool = () => {
  return new Promise((resolve, reject) => {
    pool.end(err => {
      if (err) {
        console.error('Erro ao fechar pool de conexões:', err);
        return reject(err);
      }
      console.log('Pool de conexões do MySQL fechada com sucesso');
      resolve();
    });
  });
};

// Exporta a pool com suporte a Promises para uso em funções async/await
module.exports = {
  pool: pool.promise(),
  closePool
};
