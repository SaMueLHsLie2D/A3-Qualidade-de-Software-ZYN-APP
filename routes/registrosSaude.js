const express = require('express');
const router = express.Router();
const db = require('../db');

//Alterar registro de saúde
router.put('/alterar', async (req, res) => {
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

module.exports = router;