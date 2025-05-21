const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Listar todos os usuários
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id, nome, email FROM usuarios');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Encontrar usuário por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT id, nome, email FROM usuarios WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Encontrar usuário por email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Criar novo usuário
  static async create(userData) {
    try {
      const { nome, email, senha } = userData;
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      const [result] = await db.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Criar usuário com dados de saúde
  static async createWithHealthData(userData) {
    try {
      const { nome, email, senha, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso } = userData;
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      // Iniciar transação
      await db.query('START TRANSACTION');
      
      // Inserir usuário
      const [userResult] = await db.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword]
      );
      
      const userId = userResult.insertId;
      
      // Inserir dados de saúde
      await db.query(
        'INSERT INTO registros_saude (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso]
      );
      
      // Confirmar transação
      await db.query('COMMIT');
      
      return userId;
    } catch (error) {
      // Reverter transação em caso de erro
      await db.query('ROLLBACK');
      throw error;
    }
  }

  // Verificar credenciais de login
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

  // Deletar usuário
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
