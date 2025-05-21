/**
 * Controller para gerenciamento de usuários
 * 
 * Este módulo contém funções para manipulação de usuários, incluindo
 * listagem, cadastro, autenticação e remoção de usuários.(Apenas para os desenvolvedores)
 * 
 * @module userController
 */

const User = require('../models/User');

const userController = {
  /**
   * Lista todos os usuários cadastrados
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com lista de usuários ou mensagem de erro
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  /**
   * Cadastra um novo usuário com seus dados de saúde iniciais
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do usuário e métricas de saúde
   * @param {string} req.body.nome - Nome do usuário
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.senha - Senha do usuário (será convertida em hash)
   * @param {number} req.body.peso - Peso do usuário em kg
   * @param {number} req.body.altura - Altura do usuário em metros
   * @param {number} [req.body.gordura_corporal] - Percentual de gordura corporal
   * @param {boolean} [req.body.faz_exercicio] - Indica se o usuário pratica exercícios
   * @param {number} [req.body.meta_perda_peso] - Meta de perda de peso em kg
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso e ID do usuário ou mensagem de erro
   */
  registerFull: async (req, res) => {
    try {
      const userData = req.body;
      
      // Validações básicas
      if (!userData.nome || !userData.email || !userData.senha || 
          !userData.peso || !userData.altura) {
        return res.status(400).json({ erro: 'Todos os campos obrigatórios devem ser preenchidos' });
      }
      
      // Verificar se email já existe
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
      
      // Criar usuário com dados de saúde
      const userId = await User.createWithHealthData(userData);
      
      res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario_id: userId
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
  },

  /**
   * Autentica um usuário com email e senha
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Credenciais do usuário
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.senha - Senha do usuário
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com dados do usuário autenticado ou mensagem de erro
   */
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      
      // Validações básicas
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }
      
      // Verificar credenciais
      const user = await User.verifyCredentials(email, senha);
      
      if (!user) {
        return res.status(401).json({ erro: 'Email ou senha inválidos' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ erro: 'Erro ao fazer login' });
    }
  },

  /**
   * Remove um usuário do sistema
   * 
   * @async
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID do usuário a ser removido
   * @param {Object} res - Objeto de resposta Express
   * @returns {Object} JSON com mensagem de sucesso ou erro
   */
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Verificar se usuário existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      
      // Deletar usuário
      const deleted = await User.delete(userId);
      
      if (deleted) {
        res.status(200).json({ mensagem: 'Usuário deletado com sucesso!' });
      } else {
        res.status(500).json({ erro: 'Erro ao deletar usuário' });
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ erro: 'Erro ao deletar usuário' });
    }
  }
};

module.exports = userController;
