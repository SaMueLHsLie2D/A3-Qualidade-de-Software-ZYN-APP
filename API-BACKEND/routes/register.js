const express = require('express');
const router = express.Router();
const db = require('../db');

//Alterar registro de saúde

router.put('/update-full', async (req, res) => {
  const { usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE registros_saude 
       SET peso = ?, altura = ?, gordura_corporal = ?, faz_exercicio = ?, meta_perda_peso = ?
       WHERE usuario_id = ?`,
      [peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso, usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Registro de saúde atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Altera o registro de peso

router.put('/weight', async (req, res) => {
  const { usuario_id, peso } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE registros_saude 
       SET peso = ?
       WHERE usuario_id = ?`,
      [peso, usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Peso atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Altera o registro de altura

router.put('/height', async (req, res) => {
  const { usuario_id, altura } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE registros_saude 
       SET altura = ?
       WHERE usuario_id = ?`,
      [altura, usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Altura atualizada com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Altera o registro de gordura_corporal

router.put('/body-fat', async (req, res) => {
  const { usuario_id, gordura_corporal } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE registros_saude 
       SET gordura_corporal = ?
       WHERE usuario_id = ?`,
      [gordura_corporal, usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Gordura corporal atualizada com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Altera o registro de faz_exercicio

router.put('/exercise', async (req, res) => {
  const { usuario_id, faz_exercicio } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE registros_saude 
       SET faz_exercicio = ?
       WHERE usuario_id = ?`,
      [faz_exercicio, usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Registro de exercício atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// Altera o registro de meta_perda_peso

router.put('/weight-goal', async (req, res) => {
  const { usuario_id, meta_perda_peso } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE registros_saude 
       SET meta_perda_peso = ?
       WHERE usuario_id = ?`,
      [meta_perda_peso, usuario_id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Meta de perda de peso atualizada com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Registro de saúde não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
