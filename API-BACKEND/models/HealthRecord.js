/**
 * Modelo para gerenciamento de registros de saúde
 * 
 * Este módulo contém métodos para manipulação de dados de saúde dos usuários no banco de dados,
 * incluindo busca e atualização de métricas como peso, altura, gordura corporal, status de exercício
 * e meta de perda de peso.(Apenas para os desenvolvedores)
 * 
 * @module HealthRecord
 */

const { pool } = require('../config/db');

class HealthRecord {
  /**
   * Busca um registro de saúde pelo ID do usuário
   * 
   * @async
   * @param {number} userId - ID do usuário
   * @returns {Object|null} Dados de saúde do usuário ou null se não encontrado
   * @throws {Error} Erro de consulta ao banco de dados
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM registros_saude WHERE usuario_id = ?',
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza todos os dados de saúde de um usuário
   * 
   * @async
   * @param {Object} data - Dados de saúde do usuário
   * @param {number} data.usuario_id - ID do usuário
   * @param {number} data.peso - Peso do usuário em kg
   * @param {number} data.altura - Altura do usuário em metros
   * @param {number} [data.gordura_corporal] - Percentual de gordura corporal
   * @param {boolean} [data.faz_exercicio] - Indica se o usuário pratica exercícios
   * @param {number} [data.meta_perda_peso] - Meta de perda de peso em kg
   * @returns {boolean} true se o registro foi atualizado, false caso contrário
   * @throws {Error} Erro de atualização no banco de dados
   */
  static async updateFull(data) {
    try {
      const { usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso } = data;
      
      const [result] = await pool.query(
        `UPDATE registros_saude 
         SET peso = ?, altura = ?, gordura_corporal = ?, faz_exercicio = ?, meta_perda_peso = ? 
         WHERE usuario_id = ?`,
        [peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso, usuario_id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza apenas o peso do usuário
   * 
   * @async
   * @param {number} userId - ID do usuário
   * @param {number} peso - Novo peso do usuário em kg
   * @returns {boolean} true se o registro foi atualizado, false caso contrário
   * @throws {Error} Erro de atualização no banco de dados
   */
  static async updateWeight(userId, peso) {
    try {
      const [result] = await pool.query(
        'UPDATE registros_saude SET peso = ? WHERE usuario_id = ?',
        [peso, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza apenas a altura do usuário
   * 
   * @async
   * @param {number} userId - ID do usuário
   * @param {number} altura - Nova altura do usuário em metros
   * @returns {boolean} true se o registro foi atualizado, false caso contrário
   * @throws {Error} Erro de atualização no banco de dados
   */
  static async updateHeight(userId, altura) {
    try {
      const [result] = await pool.query(
        'UPDATE registros_saude SET altura = ? WHERE usuario_id = ?',
        [altura, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza apenas o percentual de gordura corporal do usuário
   * 
   * @async
   * @param {number} userId - ID do usuário
   * @param {number} gorduraCorporal - Novo percentual de gordura corporal
   * @returns {boolean} true se o registro foi atualizado, false caso contrário
   * @throws {Error} Erro de atualização no banco de dados
   */
  static async updateBodyFat(userId, gorduraCorporal) {
    try {
      const [result] = await pool.query(
        'UPDATE registros_saude SET gordura_corporal = ? WHERE usuario_id = ?',
        [gorduraCorporal, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza o status de prática de exercícios do usuário
   * 
   * @async
   * @param {number} userId - ID do usuário
   * @param {boolean} fazExercicio - Novo status de prática de exercícios
   * @returns {boolean} true se o registro foi atualizado, false caso contrário
   * @throws {Error} Erro de atualização no banco de dados
   */
  static async updateExerciseStatus(userId, fazExercicio) {
    try {
      const [result] = await pool.query(
        'UPDATE registros_saude SET faz_exercicio = ? WHERE usuario_id = ?',
        [fazExercicio, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza a meta de perda de peso do usuário
   * 
   * @async
   * @param {number} userId - ID do usuário
   * @param {number} metaPerdaPeso - Nova meta de perda de peso em kg
   * @returns {boolean} true se o registro foi atualizado, false caso contrário
   * @throws {Error} Erro de atualização no banco de dados
   */
  static async updateWeightGoal(userId, metaPerdaPeso) {
    try {
      const [result] = await pool.query(
        'UPDATE registros_saude SET meta_perda_peso = ? WHERE usuario_id = ?',
        [metaPerdaPeso, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HealthRecord;
