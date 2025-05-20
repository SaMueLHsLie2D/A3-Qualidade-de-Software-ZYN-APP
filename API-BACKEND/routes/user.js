const express = require('express');
const router = express.Router();
const db = require('../db');

// Cadastro de usuário

router.post('/register-full', async (req, res) => {
  const {
    nome,
    email,
    senha,
    peso,
    altura,
    gordura_corporal,
    faz_exercicio,
    meta_perda_peso
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [usuarioResult] = await conn.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senha]
    );

    const usuario_id = usuarioResult.insertId;

    await conn.execute(
      `INSERT INTO registros_saude 
        (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso]
    );

    await conn.commit();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario_id });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ erro: err.message });
  } finally {
    conn.release();
  }
});

// Login de usuário

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );
    if (rows.length > 0) {
      res.status(200).json({ id: rows[0].id, nome: rows[0].nome });
    } else {
      res.status(401).json({ erro: 'Email ou senha inválidos' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;

// Deletar usuário

router.delete('/:id', async (req, res) => {
  const usuarioId = req.params.id;
  try {
    const [result] = await db.execute(
      'DELETE FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ mensagem: 'Usuário deletado com sucesso!' });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});