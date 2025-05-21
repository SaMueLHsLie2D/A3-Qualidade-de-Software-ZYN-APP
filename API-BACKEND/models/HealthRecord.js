const db = require('../config/db');

class HealthRecord {
  // Encontrar registro de saúde por ID de usuário
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM registros_saude WHERE usuario_id = ?',
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Atualizar registro de saúde completo
  static async updateFull(data) {
    try {
      const { usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso } = data;
      
      const [result] = await db.query(
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

  // Atualizar apenas o peso
  static async updateWeight(userId, peso) {
    try {
      const [result] = await db.query(
        'UPDATE registros_saude SET peso = ? WHERE usuario_id = ?',
        [peso, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar apenas a altura
  static async updateHeight(userId, altura) {
    try {
      const [result] = await db.query(
        'UPDATE registros_saude SET altura = ? WHERE usuario_id = ?',
        [altura, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar apenas a gordura corporal
  static async updateBodyFat(userId, gorduraCorporal) {
    try {
      const [result] = await db.query(
        'UPDATE registros_saude SET gordura_corporal = ? WHERE usuario_id = ?',
        [gorduraCorporal, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar status de exercício
  static async updateExerciseStatus(userId, fazExercicio) {
    try {
      const [result] = await db.query(
        'UPDATE registros_saude SET faz_exercicio = ? WHERE usuario_id = ?',
        [fazExercicio, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar meta de perda de peso
  static async updateWeightGoal(userId, metaPerdaPeso) {
    try {
      const [result] = await db.query(
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
