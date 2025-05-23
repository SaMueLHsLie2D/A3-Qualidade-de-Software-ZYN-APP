/**
 * Modelo para gerenciamento de usuários
 * 
 * Este módulo contém métodos para manipulação de dados de usuários no banco de dados,
 * incluindo busca, criação, autenticação e remoção.(Apenas para os desenvolvedores)
 * 
 * @module User
 */

const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  /**
   * Lista todos os usuários cadastrados
   * 
   * @async
   * @returns {Array} Lista de usuários com id, nome e email
   * @throws {Error} Erro de consulta ao banco de dados
   */
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT id, nome, email FROM usuarios');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um usuário pelo ID
   * 
   * @async
   * @param {number} id - ID do usuário
   * @returns {Object|null} Dados do usuário ou null se não encontrado
   * @throws {Error} Erro de consulta ao banco de dados
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um usuário pelo email
   * 
   * @async
   * @param {string} email - Email do usuário
   * @returns {Object|null} Dados completos do usuário ou null se não encontrado
   * @throws {Error} Erro de consulta ao banco de dados
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria um novo usuário
   * 
   * @async
   * @param {Object} userData - Dados do usuário
   * @param {string} userData.nome - Nome do usuário
   * @param {string} userData.email - Email do usuário
   * @param {string} userData.senha - Senha do usuário (será convertida em hash)
   * @returns {number} ID do usuário criado
   * @throws {Error} Erro de inserção no banco de dados
   */
  static async create(userData) {
    try {
      const { nome, email, senha } = userData;
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      const [result] = await pool.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria um novo usuário com seus dados de saúde iniciais
   * 
   * @async
   * @param {Object} userData - Dados do usuário e métricas de saúde
   * @param {string} userData.nome - Nome do usuário
   * @param {string} userData.email - Email do usuário
   * @param {string} userData.senha - Senha do usuário (será convertida em hash)
   * @param {number} userData.peso - Peso do usuário em kg
   * @param {number} userData.altura - Altura do usuário em metros
   * @param {number} [userData.gordura_corporal] - Percentual de gordura corporal
   * @param {boolean} [userData.faz_exercicio] - Indica se o usuário pratica exercícios
   * @param {number} [userData.meta_perda_peso] - Meta de perda de peso em kg
   * @returns {number} ID do usuário criado
   * @throws {Error} Erro de inserção no banco de dados
   */
  static async createWithHealthData(userData) {
    const connection = await pool.getConnection();
    
    try {
      const { nome, email, senha, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso } = userData;
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      // Iniciar transação
      await connection.beginTransaction();
      
      // Inserir usuário
      const [userResult] = await connection.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword]
      );
      
      const userId = userResult.insertId;

      // Converter 'sim'/'nao' para 1/0
      const fazExercicioInt = faz_exercicio === 'sim' ? 1 : 0;
      
      // Inserir dados de saúde
      await connection.query(
        'INSERT INTO registros_saude (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, peso, altura, gordura_corporal, fazExercicioInt, meta_perda_peso] // Usa a porra da variável convertida
      );
      
      // Confirmar transação
      await connection.commit();
      
      return userId;
    } catch (error) {
      // Reverter transação em caso de erro
      await connection.rollback();
      throw error;
    } finally {
      // Importante: liberar a conexão de volta para a pool
      connection.release();
    }
  }

  /**
   * Verifica as credenciais de um usuário
   * 
   * @async
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Object|null} Dados básicos do usuário ou null se credenciais inválidas
   * @throws {Error} Erro de consulta ao banco de dados
   */
  static async verifyCredentials(email, senha) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      
      if (!isPasswordValid) {
        return null;
      }
      
      return {
        id: user.id,
        nome: user.nome
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove um usuário do sistema
   * 
   * @async
   * @param {number} id - ID do usuário a ser removido
   * @returns {boolean} true se o usuário foi removido, false caso contrário
   * @throws {Error} Erro de remoção no banco de dados
   */
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
