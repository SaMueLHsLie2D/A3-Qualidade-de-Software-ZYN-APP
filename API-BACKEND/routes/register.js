const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { validate, userValidations } = require('../middleware/validator');

// Obter histórico de métricas (protegido)
router.get('/historico/:usuario_id', 
  authenticateToken,
  async (req, res) => {
    const usuario_id = req.params.usuario_id;
    const tipo_metrica = req.query.tipo_metrica;
    const data_inicio = req.query.data_inicio;
    const data_fim = req.query.data_fim;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    try {
      let query = 'SELECT * FROM historico_metricas WHERE usuario_id = ?';
      let countQuery = 'SELECT COUNT(*) as total FROM historico_metricas WHERE usuario_id = ?';
      let params = [usuario_id];
      let countParams = [usuario_id];
      
      // Filtrar por tipo de métrica
      if (tipo_metrica) {
        query += ' AND tipo_metrica = ?';
        countQuery += ' AND tipo_metrica = ?';
        params.push(tipo_metrica);
        countParams.push(tipo_metrica);
      }
      
      // Filtrar por período
      if (data_inicio) {
        query += ' AND data_registro >= ?';
        countQuery += ' AND data_registro >= ?';
        params.push(data_inicio);
        countParams.push(data_inicio);
      }
      
      if (data_fim) {
        query += ' AND data_registro <= ?';
        countQuery += ' AND data_registro <= ?';
        params.push(data_fim);
        countParams.push(data_fim);
      }
      
      // Ordenar por data mais recente
      query += ' ORDER BY data_registro DESC';
      
      // Adicionar paginação
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [rows] = await db.execute(query, params);
      const [countResult] = await db.execute(countQuery, countParams);
      const totalItems = countResult[0].total;
      
      res.status(200).json({
        status: 'success',
        data: rows,
        pagination: {
          total: totalItems,
          page,
          limit,
          pages: Math.ceil(totalItems / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    }
  }
);

//Alterar registro de saúde
router.put('/update-full', 
  validate([
    userValidations.usuario_id,
    userValidations.peso,
    userValidations.altura,
    userValidations.gordura_corporal,
    userValidations.faz_exercicio,
    userValidations.meta_perda_peso
  ]),
  async (req, res) => {
    const { usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso } = req.body;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Atualizar registro atual
      const [result] = await conn.execute(
        `UPDATE registros_saude 
         SET peso = ?, altura = ?, gordura_corporal = ?, faz_exercicio = ?, meta_perda_peso = ?
         WHERE usuario_id = ?`,
        [peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso, usuario_id]
      );
      
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ 
          status: 'error',
          message: 'Registro de saúde não encontrado.' 
        });
      }
      
      // Registrar no histórico
      const dataRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await conn.execute(
        `INSERT INTO historico_metricas 
          (usuario_id, tipo_metrica, valor, data_registro)
         VALUES 
          (?, 'peso', ?, ?),
          (?, 'altura', ?, ?),
          (?, 'gordura_corporal', ?, ?),
          (?, 'meta_perda_peso', ?, ?)`,
        [
          usuario_id, peso, dataRegistro,
          usuario_id, altura, dataRegistro,
          usuario_id, gordura_corporal, dataRegistro,
          usuario_id, meta_perda_peso, dataRegistro
        ]
      );
      
      await conn.commit();
      res.status(200).json({ 
        status: 'success',
        message: 'Registro de saúde atualizado com sucesso!' 
      });
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    } finally {
      conn.release();
    }
  }
);

// Altera o registro de peso
router.put('/weight', 
  validate([
    userValidations.usuario_id,
    userValidations.peso
  ]),
  async (req, res) => {
    const { usuario_id, peso } = req.body;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Atualizar registro atual
      const [result] = await conn.execute(
        `UPDATE registros_saude 
         SET peso = ?
         WHERE usuario_id = ?`,
        [peso, usuario_id]
      );
      
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ 
          status: 'error',
          message: 'Registro de saúde não encontrado.' 
        });
      }
      
      // Registrar no histórico
      const dataRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await conn.execute(
        `INSERT INTO historico_metricas 
          (usuario_id, tipo_metrica, valor, data_registro)
         VALUES (?, 'peso', ?, ?)`,
        [usuario_id, peso, dataRegistro]
      );
      
      await conn.commit();
      res.status(200).json({ 
        status: 'success',
        message: 'Peso atualizado com sucesso!' 
      });
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    } finally {
      conn.release();
    }
  }
);

// Altera o registro de altura
router.put('/height', 
  validate([
    userValidations.usuario_id,
    userValidations.altura
  ]),
  async (req, res) => {
    const { usuario_id, altura } = req.body;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Atualizar registro atual
      const [result] = await conn.execute(
        `UPDATE registros_saude 
         SET altura = ?
         WHERE usuario_id = ?`,
        [altura, usuario_id]
      );
      
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ 
          status: 'error',
          message: 'Registro de saúde não encontrado.' 
        });
      }
      
      // Registrar no histórico
      const dataRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await conn.execute(
        `INSERT INTO historico_metricas 
          (usuario_id, tipo_metrica, valor, data_registro)
         VALUES (?, 'altura', ?, ?)`,
        [usuario_id, altura, dataRegistro]
      );
      
      await conn.commit();
      res.status(200).json({ 
        status: 'success',
        message: 'Altura atualizada com sucesso!' 
      });
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    } finally {
      conn.release();
    }
  }
);

// Altera o registro de gordura_corporal
router.put('/body-fat', 
  validate([
    userValidations.usuario_id,
    userValidations.gordura_corporal
  ]),
  async (req, res) => {
    const { usuario_id, gordura_corporal } = req.body;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Atualizar registro atual
      const [result] = await conn.execute(
        `UPDATE registros_saude 
         SET gordura_corporal = ?
         WHERE usuario_id = ?`,
        [gordura_corporal, usuario_id]
      );
      
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ 
          status: 'error',
          message: 'Registro de saúde não encontrado.' 
        });
      }
      
      // Registrar no histórico
      const dataRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await conn.execute(
        `INSERT INTO historico_metricas 
          (usuario_id, tipo_metrica, valor, data_registro)
         VALUES (?, 'gordura_corporal', ?, ?)`,
        [usuario_id, gordura_corporal, dataRegistro]
      );
      
      await conn.commit();
      res.status(200).json({ 
        status: 'success',
        message: 'Gordura corporal atualizada com sucesso!' 
      });
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    } finally {
      conn.release();
    }
  }
);

// Altera o registro de faz_exercicio
router.put('/exercise', 
  validate([
    userValidations.usuario_id,
    userValidations.faz_exercicio
  ]),
  async (req, res) => {
    const { usuario_id, faz_exercicio } = req.body;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    try {
      const [result] = await db.execute(
        `UPDATE registros_saude 
         SET faz_exercicio = ?
         WHERE usuario_id = ?`,
        [faz_exercicio, usuario_id]
      );
      
      if (result.affectedRows > 0) {
        res.status(200).json({ 
          status: 'success',
          message: 'Registro de exercício atualizado com sucesso!' 
        });
      } else {
        res.status(404).json({ 
          status: 'error',
          message: 'Registro de saúde não encontrado.' 
        });
      }
    } catch (err) {
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    }
  }
);

// Altera o registro de meta_perda_peso
router.put('/weight-goal', 
  validate([
    userValidations.usuario_id,
    userValidations.meta_perda_peso
  ]),
  async (req, res) => {
    const { usuario_id, meta_perda_peso } = req.body;
    
    // Verificar se o usuário tem permissão
    if (req.user.id != usuario_id) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Acesso negado' 
      });
    }
    
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Atualizar registro atual
      const [result] = await conn.execute(
        `UPDATE registros_saude 
         SET meta_perda_peso = ?
         WHERE usuario_id = ?`,
        [meta_perda_peso, usuario_id]
      );
      
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ 
          status: 'error',
          message: 'Registro de saúde não encontrado.' 
        });
      }
      
      // Registrar no histórico
      const dataRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await conn.execute(
        `INSERT INTO historico_metricas 
          (usuario_id, tipo_metrica, valor, data_registro)
         VALUES (?, 'meta_perda_peso', ?, ?)`,
        [usuario_id, meta_perda_peso, dataRegistro]
      );
      
      await conn.commit();
      res.status(200).json({ 
        status: 'success',
        message: 'Meta de perda de peso atualizada com sucesso!' 
      });
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    } finally {
      conn.release();
    }
  }
);

module.exports = router;
