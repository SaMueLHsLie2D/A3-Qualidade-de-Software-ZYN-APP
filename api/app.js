const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const registerRoutes = require('./routes/register'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/saude', registerRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});