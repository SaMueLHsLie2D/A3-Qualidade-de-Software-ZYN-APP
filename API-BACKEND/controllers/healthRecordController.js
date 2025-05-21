/**
 * Controller para gerenciamento de registros de saúde
 * 
 * Este módulo contém funções para manipulação de registros de saúde dos usuários,
 * incluindo atualização de métricas como peso, altura, gordura corporal, status de exercício
 * e meta de perda de peso.(Apenas para os desenvolvedores)
 * 
 * @module healthRecordController
 */

const HealthRecord = require('../models/HealthRecord');

const healthRecordController = {
  /**
   * Atualiza todos os dados de saúde de um usuário
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados de saúde do usuário
   * @param {number} req.body.usuario_id - ID do usuário
   * @param {number} req.body.peso - Peso do usuário em kg
   * @param {number} req.body.altura - Altura do usuário em metros
   * @param {number} [req.body.gordura_corporal] - Percentual de gordura corporal
   * @param {boolean} [req.body.faz_exercicio] - Indica se o usuário pratica exercícios
   * @param {number} [req.body.meta_perda_peso] - Meta de perda de peso em kg
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  updateFull: async (req, res) => {
    try {
      const healthData = req.body;
      
      // Validações básicas
      if (!healthData.usuario_id || !healthData.peso || !healthData.altura) {
        return res.status(400).json({ erro: 'Todos os campos obrigatórios devem ser preenchidos' });
      }
      
      // Verificar se registro existe
      const existingRecord = await HealthRecord.findByUserId(healthData.usuario_id);
      if (!existingRecord) {
        return res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
      }
      
      // Atualizar registro
      const updated = await HealthRecord.updateFull(healthData);
      
      if (updated) {
        res.status(200).json({ mensagem: 'Registro de saúde atualizado com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao atualizar registro de saúde' });
      }
    } catch (error) {
      console.error('Erro ao atualizar registro de saúde:', error);
      res.status(500).json({ erro: 'Erro ao atualizar registro de saúde' });
    }
  },

  /**
   * Atualiza apenas o peso do usuário
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do usuário
   * @param {number} req.body.usuario_id - ID do usuário
   * @param {number} req.body.peso - Novo peso do usuário em kg
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  updateWeight: async (req, res) => {
    try {
      const { usuario_id, peso } = req.body;
      
      // Validações básicas
      if (!usuario_id || !peso) {
        return res.status(400).json({ erro: 'ID do usuário e peso são obrigatórios' });
      }
      
      // Verificar se registro existe
      const existingRecord = await HealthRecord.findByUserId(usuario_id);
      if (!existingRecord) {
        return res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
      }
      
      // Atualizar peso
      const updated = await HealthRecord.updateWeight(usuario_id, peso);
      
      if (updated) {
        res.status(200).json({ mensagem: 'Peso atualizado com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao atualizar peso' });
      }
    } catch (error) {
      console.error('Erro ao atualizar peso:', error);
      res.status(500).json({ erro: 'Erro ao atualizar peso' });
    }
  },

  /**
   * Atualiza apenas a altura do usuário
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do usuário
   * @param {number} req.body.usuario_id - ID do usuário
   * @param {number} req.body.altura - Nova altura do usuário em metros
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  updateHeight: async (req, res) => {
    try {
      const { usuario_id, altura } = req.body;
      
      // Validações básicas
      if (!usuario_id || !altura) {
        return res.status(400).json({ erro: 'ID do usuário e altura são obrigatórios' });
      }
      
      // Verificar se registro existe
      const existingRecord = await HealthRecord.findByUserId(usuario_id);
      if (!existingRecord) {
        return res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
      }
      
      // Atualizar altura
      const updated = await HealthRecord.updateHeight(usuario_id, altura);
      
      if (updated) {
        res.status(200).json({ mensagem: 'Altura atualizada com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao atualizar altura' });
      }
    } catch (error) {
      console.error('Erro ao atualizar altura:', error);
      res.status(500).json({ erro: 'Erro ao atualizar altura' });
    }
  },

  /**
   * Atualiza apenas o percentual de gordura corporal do usuário
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do usuário
   * @param {number} req.body.usuario_id - ID do usuário
   * @param {number} req.body.gordura_corporal - Novo percentual de gordura corporal
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  updateBodyFat: async (req, res) => {
    try {
      const { usuario_id, gordura_corporal } = req.body;
      
      // Validações básicas
      if (!usuario_id || gordura_corporal === undefined) {
        return res.status(400).json({ erro: 'ID do usuário e gordura corporal são obrigatórios' });
      }
      
      // Verificar se registro existe
      const existingRecord = await HealthRecord.findByUserId(usuario_id);
      if (!existingRecord) {
        return res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
      }
      
      // Atualizar gordura corporal
      const updated = await HealthRecord.updateBodyFat(usuario_id, gordura_corporal);
      
      if (updated) {
        res.status(200).json({ mensagem: 'Gordura corporal atualizada com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao atualizar gordura corporal' });
      }
    } catch (error) {
      console.error('Erro ao atualizar gordura corporal:', error);
      res.status(500).json({ erro: 'Erro ao atualizar gordura corporal' });
    }
  },

  /**
   * Atualiza o status de prática de exercícios do usuário
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do usuário
   * @param {number} req.body.usuario_id - ID do usuário
   * @param {boolean} req.body.faz_exercicio - Novo status de prática de exercícios
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  updateExerciseStatus: async (req, res) => {
    try {
      const { usuario_id, faz_exercicio } = req.body;
      
      // Validações básicas
      if (!usuario_id || faz_exercicio === undefined) {
        return res.status(400).json({ erro: 'ID do usuário e status de exercício são obrigatórios' });
      }
      
      // Verificar se registro existe
      const existingRecord = await HealthRecord.findByUserId(usuario_id);
      if (!existingRecord) {
        return res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
      }
      
      // Atualizar status de exercício
      const updated = await HealthRecord.updateExerciseStatus(usuario_id, faz_exercicio);
      
      if (updated) {
        res.status(200).json({ mensagem: 'Registro de exercício atualizado com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao atualizar status de exercício' });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de exercício:', error);
      res.status(500).json({ erro: 'Erro ao atualizar status de exercício' });
    }
  },

  /**
   * Atualiza a meta de perda de peso do usuário
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do usuário
   * @param {number} req.body.usuario_id - ID do usuário
   * @param {number} req.body.meta_perda_peso - Nova meta de perda de peso em kg
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  updateWeightGoal: async (req, res) => {
    try {
      const { usuario_id, meta_perda_peso } = req.body;
      
      // Validações básicas
      if (!usuario_id || meta_perda_peso === undefined) {
        return res.status(400).json({ erro: 'ID do usuário e meta de perda de peso são obrigatórios' });
      }
      
      // Verificar se registro existe
      const existingRecord = await HealthRecord.findByUserId(usuario_id);
      if (!existingRecord) {
        return res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
      }
      
      // Atualizar meta de perda de peso
      const updated = await HealthRecord.updateWeightGoal(usuario_id, meta_perda_peso);
      
      if (updated) {
        res.status(200).json({ mensagem: 'Meta de perda de peso atualizada com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao atualizar meta de perda de peso' });
      }
    } catch (error) {
      console.error('Erro ao atualizar meta de perda de peso:', error);
      res.status(500).json({ erro: 'Erro ao atualizar meta de perda de peso' });
    }
  }
};

module.exports = healthRecordController;
