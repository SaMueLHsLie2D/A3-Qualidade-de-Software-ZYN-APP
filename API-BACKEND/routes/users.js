const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar todos os usuários
router.get('/', userController.getAllUsers);

// Cadastrar usuário com dados de saúde
router.post('/register-full', userController.registerFull);

// Login de usuário
router.post('/login', userController.login);

// Deletar usuário
router.delete('/:id', userController.deleteUser);

module.exports = router;
