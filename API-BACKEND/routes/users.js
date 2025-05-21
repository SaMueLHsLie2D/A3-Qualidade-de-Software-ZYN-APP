/**
 * Rotas para gerenciamento de usuários
 * 
 * Este módulo define as rotas da API relacionadas aos usuários,
 * incluindo listagem, cadastro, autenticação e remoção.(isso é o que vai pra o front-end)
 * 
 * @module routes/users
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @route GET /api/users
 * @description Lista todos os usuários cadastrados
 * @access Público (recomendado implementar autenticação)
 */
router.get('/', userController.getAllUsers);

/**
 * @route POST /api/users/register-full
 * @description Cadastra um novo usuário com seus dados de saúde iniciais
 * @access Público
 */
router.post('/register-full', userController.registerFull);

/**
 * @route POST /api/users/login
 * @description Autentica um usuário com email e senha
 * @access Público
 */
router.post('/login', userController.login);

/**
 * @route DELETE /api/users/:id
 * @description Remove um usuário do sistema
 * @access Privado (recomendado implementar autenticação)
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
