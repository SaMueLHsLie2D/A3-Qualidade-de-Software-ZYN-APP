/**
 * Configuração principal da aplicação Express
 * 
 * Este arquivo configura a aplicação Express, incluindo middlewares,
 * rotas e outras configurações necessárias para o funcionamento da API.
 * 
 * @module app
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/users');
const healthRecordsRoutes = require('./routes/healthRecords');

// Inicializa a aplicação Express
const app = express();

// Configura middlewares
app.use(cors()); // Habilita CORS para todas as origens
app.use(bodyParser.json()); // Processa requisições com corpo JSON

// Configura rotas da API
app.use('/api/users', userRoutes); // Rotas de usuários
app.use('/api/registros-saude', healthRecordsRoutes); // Rotas de registros de saúde

// Exporta a aplicação configurada para uso no servidor
module.exports = app;
