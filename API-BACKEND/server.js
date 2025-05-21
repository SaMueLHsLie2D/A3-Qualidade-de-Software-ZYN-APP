const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Importar rotas
const userRoutes = require('./routes/users');
const healthRecordsRoutes = require('./routes/healthRecords');

// Usar rotas
app.use('/api/users', userRoutes);
app.use('/api/registros-saude', healthRecordsRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API ZYN funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
