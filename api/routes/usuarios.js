const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash]
    );
    res.status(201).json({ id: result.insertId, nome, email });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ erro: 'Senha incorreta' });

    res.json({ mensagem: 'Login bem-sucedido', usuario: { id: usuario.id, nome: usuario.nome } });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhes: err.message });
  }
});

module.exports = router;