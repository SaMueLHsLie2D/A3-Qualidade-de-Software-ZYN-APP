const jwt = require('jsonwebtoken');

// Chave secreta para assinatura do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'zyn_app_secret_key';

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Adicionar o usuário decodificado à requisição
    req.user = decoded;
    
    // Prosseguir para o próximo middleware/rota
    next();
  } catch (error) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};

// Função para gerar token JWT
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: '24h' } // Token expira em 24 horas
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};
