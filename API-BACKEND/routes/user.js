const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { validate, userValidations } = require('../middleware/validator');

// Listar usuários (protegido)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Implementar paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const [rows] = await db.execute(
      'SELECT id, nome, email FROM usuarios LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM usuarios');
    const totalUsers = countResult[0].total;
    
    res.status(200).json({
      status: 'success',
      data: rows,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
});

// Cadastro de usuário
router.post('/register-full', 
  validate([
    userValidations.nome,
    userValidations.email,
    userValidations.senha,
    userValidations.peso,
    userValidations.altura,
    userValidations.gordura_corporal,
    userValidations.faz_exercicio,
    userValidations.meta_perda_peso
  ]),
  async (req, res) => {
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
      // Verificar se o email já existe
      const [existingUser] = await conn.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
      );
      
      if (existingUser.length > 0) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Email já cadastrado' 
        });
      }
      
      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);
      
      await conn.beginTransaction();
      const [usuarioResult] = await conn.execute(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword]
      );
      
      const usuario_id = usuarioResult.insertId;
      
      // Inserir registro de saúde inicial
      await conn.execute(
        `INSERT INTO registros_saude 
          (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso]
      );
      
      // Inserir no histórico de métricas
      const dataRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await conn.execute(
        `INSERT INTO historico_metricas 
          (usuario_id, tipo_metrica, valor, data_registro)
         VALUES 
          (?, 'peso', ?, ?),
          (?, 'altura', ?, ?),
          (?, 'gordura_corporal', ?, ?)`,
        [
          usuario_id, peso, dataRegistro,
          usuario_id, altura, dataRegistro,
          usuario_id, gordura_corporal, dataRegistro
        ]
      );
      
      await conn.commit();
      
      // Gerar token JWT
      const token = generateToken(usuario_id, email);
      
      res.status(201).json({ 
        status: 'success',
        message: 'Usuário cadastrado com sucesso!', 
        data: {
          usuario_id,
          token
        }
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

// Login de usuário
router.post('/login',
  validate([
    userValidations.email,
    body('senha').notEmpty().withMessage('Senha é obrigatória')
  ]),
  async (req, res) => {
    const { email, senha } = req.body;
    
    try {
      const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
      
      if (rows.length === 0) {
        return res.status(401).json({ 
          status: 'error',
          message: 'Email ou senha inválidos' 
        });
      }
      
      const user = rows[0];
      
      // Verificar senha com bcrypt
      const passwordMatch = await bcrypt.compare(senha, user.senha);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          status: 'error',
          message: 'Email ou senha inválidos' 
        });
      }
      
      // Gerar token JWT
      const token = generateToken(user.id, user.email);
      
      res.status(200).json({ 
        status: 'success',
        data: {
          id: user.id, 
          nome: user.nome,
          token
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

// Recuperação de senha - Solicitar
router.post('/forgot-password',
  validate([
    userValidations.email
  ]),
  async (req, res) => {
    const { email } = req.body;
    
    try {
      const [rows] = await db.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
      );
      
      if (rows.length === 0) {
        // Por segurança, não informamos se o email existe ou não
        return res.status(200).json({ 
          status: 'success',
          message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.' 
        });
      }
      
      const user = rows[0];
      
      // Gerar token de recuperação (expira em 1 hora)
      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
      
      // Salvar token no banco
      await db.execute(
        'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [resetToken, resetTokenExpiry, user.id]
      );
      
      // Em um ambiente real, enviaríamos um email com o link para redefinição
      // Aqui apenas retornamos o token para fins de demonstração
      
      res.status(200).json({ 
        status: 'success',
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
        // Em produção, remover esta linha e enviar por email
        resetToken
      });
    } catch (err) {
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    }
  }
);

// Recuperação de senha - Redefinir
router.post('/reset-password',
  validate([
    body('token').notEmpty().withMessage('Token é obrigatório'),
    userValidations.senha
  ]),
  async (req, res) => {
    const { token, senha } = req.body;
    
    try {
      // Verificar se o token existe e não expirou
      const [rows] = await db.execute(
        'SELECT id FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()',
        [token]
      );
      
      if (rows.length === 0) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Token inválido ou expirado' 
        });
      }
      
      const user = rows[0];
      
      // Hash da nova senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);
      
      // Atualizar senha e limpar token
      await db.execute(
        'UPDATE usuarios SET senha = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hashedPassword, user.id]
      );
      
      res.status(200).json({ 
        status: 'success',
        message: 'Senha redefinida com sucesso' 
      });
    } catch (err) {
      res.status(500).json({ 
        status: 'error',
        message: err.message 
      });
    }
  }
);

// Deletar usuário (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  const usuarioId = req.params.id;
  
  // Verificar se o usuário tem permissão (apenas o próprio usuário ou admin)
  if (req.user.id != usuarioId) {
    return res.status(403).json({ 
      status: 'error',
      message: 'Acesso negado' 
    });
  }
  
  try {
    const [result] = await db.execute(
      'DELETE FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({ 
        status: 'success',
        message: 'Usuário deletado com sucesso!' 
      });
    } else {
      res.status(404).json({ 
        status: 'error',
        message: 'Usuário não encontrado' 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
});

module.exports = router;
