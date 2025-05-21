const User = require('../models/User');

// Controller para gerenciar usuários
const userController = {
  // Listar todos os usuários
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  // Cadastrar usuário com dados de saúde
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

  // Login de usuário
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

  // Deletar usuário
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
