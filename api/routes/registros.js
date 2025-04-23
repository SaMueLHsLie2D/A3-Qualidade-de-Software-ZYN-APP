const express = require('express');
const db = require('../db');
const router = express.Router();

// Criar registro de saúde
router.post('/', async (req, res) => {
  const {
    usuario_id,
    peso,
    altura,
    gordura_corporal,
    faz_exercicio,
    meta_perda_peso
  } = req.body;

  try {
    await db.execute(
      `INSERT INTO registros_saude 
       (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso]
    );
    res.status(201).json({ mensagem: 'Registro criado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao inserir registro', detalhes: err.message });
  }
});

module.exports = router;