/**
 * Configuração do banco de dados para testes
 * 
 * Este arquivo configura a conexão com o banco de dados para os testes,
 * incluindo funções para limpar o banco antes e depois dos testes.
 * 
 * @module config/db.test
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da pool de conexões para testes
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
 * Limpa as tabelas do banco de dados para testes
 * 
 * Esta função remove todos os registros das tabelas para garantir
 * que os testes sejam executados em um ambiente limpo.
 */
const cleanDatabase = async () => {
  try {
    // Desabilita verificação de chaves estrangeiras temporariamente
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpa as tabelas
    await pool.query('TRUNCATE TABLE registros_saude');
    await pool.query('TRUNCATE TABLE usuarios');
    
    // Reabilita verificação de chaves estrangeiras
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Banco de dados de teste limpo');
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error);
  }
};

/**
 * Fecha a pool de conexões
 * 
 * Esta função deve ser chamada após a conclusão dos testes
 * para garantir que todas as conexões sejam fechadas corretamente.
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('Pool de conexões fechada');
  } catch (error) {
    console.error('Erro ao fechar pool de conexões:', error);
  }
};

module.exports = {
  pool,
  cleanDatabase,
  closePool
};
