const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user');
const registerRoutes = require('./routes/register');
const { authenticateToken } = require('./middleware/auth');

const app = express();

// Middleware global
app.use(cors());
app.use(bodyParser.json());

// Rotas públicas
app.use('/api/users', userRoutes);

// Rotas protegidas
app.use('/api/registros-saude', authenticateToken, registerRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada'
  });
});

module.exports = app;
