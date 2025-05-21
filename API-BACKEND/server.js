/**
 * Servidor principal da aplicação
 * 
 * Este arquivo configura e inicia o servidor HTTP para a aplicação Express,
 * definindo a porta, middlewares, rotas e tratamento de erros.
 * 
 * @module server
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { closePool } = require('./db');

// Inicializa a aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configura middlewares
app.use(cors());
app.use(bodyParser.json());

// Importa rotas
const userRoutes = require('./routes/users');
const healthRecordsRoutes = require('./routes/healthRecords');

// Configura rotas da API
app.use('/api/users', userRoutes);
app.use('/api/registros-saude', healthRecordsRoutes);

// Rota de teste/status da API
app.get('/', (req, res) => {
  res.json({ message: 'API ZYN funcionando!', version: '1.0.0' });
});

// Inicia o servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

/**
 * Tratamento de encerramento do servidor
 * 
 * Garante que todas as conexões com o banco de dados sejam fechadas
 * corretamente quando o servidor for encerrado.
 */
process.on('SIGINT', async () => {
  console.log('Encerrando servidor...');
  
  // Fecha o servidor HTTP
  server.close(() => {
    console.log('Servidor HTTP encerrado');
    
    // Fecha a pool de conexões do banco de dados
    closePool()
      .then(() => {
        console.log('Aplicação encerrada com sucesso');
        process.exit(0);
      })
      .catch(err => {
        console.error('Erro ao encerrar aplicação:', err);
        process.exit(1);
      });
  });
});

// Exporta o servidor para uso em testes
module.exports = server;
