const express = require('express');
const { body, validationResult } = require('express-validator');

// Middleware de validação centralizado
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    
    next();
  };
};

// Validações comuns
const userValidations = {
  email: body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  senha: body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  
  nome: body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .trim(),
  
  usuario_id: body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('ID de usuário inválido'),
  
  peso: body('peso')
    .isFloat({ min: 0 })
    .withMessage('Peso deve ser um número positivo'),
  
  altura: body('altura')
    .isFloat({ min: 0 })
    .withMessage('Altura deve ser um número positivo'),
  
  gordura_corporal: body('gordura_corporal')
    .isFloat({ min: 0 })
    .withMessage('Gordura corporal deve ser um número positivo'),
  
  faz_exercicio: body('faz_exercicio')
    .isBoolean()
    .withMessage('Faz exercício deve ser um valor booleano'),
  
  meta_perda_peso: body('meta_perda_peso')
    .isFloat()
    .withMessage('Meta de perda de peso deve ser um número')
};

module.exports = {
  validate,
  userValidations
};
