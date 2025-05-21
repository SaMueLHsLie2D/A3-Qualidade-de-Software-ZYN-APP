/**
 * Configuração do ambiente de testes
 * 
 * Este arquivo configura o ambiente para testes, incluindo variáveis de ambiente
 * e funções para limpeza do banco de dados de teste.
 * 
 * @module tests/setup
 */

require('dotenv').config();
const { pool, closePool } = require('../config/db');

// Configurar variáveis de ambiente para testes
process.env.DB_NAME = process.env.DB_NAME || 'zyn_app_db_test';
process.env.NODE_ENV = 'test';

/**
 * Limpa o banco de dados de teste antes/depois dos testes
 * 
 * Esta função limpa as tabelas do banco de dados de teste para garantir
 * que cada teste seja executado em um ambiente limpo.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function clearDatabase() {
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
}

/**
 * Fecha todas as conexões após os testes
 * 
 * Esta função deve ser chamada após a conclusão de todos os testes
 * para garantir que todas as conexões com o banco sejam fechadas corretamente.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function closeConnections() {
  try {
    await closePool();
    console.log('Conexões de teste fechadas');
  } catch (error) {
    console.error('Erro ao fechar conexões de teste:', error);
  }
}

// Configurar para fechar conexões quando os testes terminarem
afterAll(async () => {
  await closeConnections();
});

module.exports = {
  clearDatabase,
  closeConnections
};
