const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    username,
    email,
    password,
    peso,
    altura,
    gordura,
    habito,
    meta
  } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Inserir usuário
    const [userResult] = await conn.execute(
      `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
      [username, email, password]
    );
    const usuario_id = userResult.insertId;

    // Inserir registro de saúde
    await conn.execute(
      `INSERT INTO registros_saude 
        (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario_id,
        peso,
        altura,
        gordura,
        habito === 'sim' ? 1 : 0,
        meta
      ]
    );

    await conn.commit();
    res.status(201).json({ mensagem: 'Usuário e registro criados com sucesso' });

  } catch (err) {
    await conn.rollback();
    console.error('Erro ao registrar:', err);
    res.status(500).json({ erro: 'Erro ao registrar', detalhes: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;