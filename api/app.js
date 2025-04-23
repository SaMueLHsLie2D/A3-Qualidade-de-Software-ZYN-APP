const express = require('express');
const app = express();
const usuariosRoutes = require('./routes/usuarios');
const registrosRoutes = require('./routes/registros');

app.use(express.json());
app.use('/usuarios', usuariosRoutes);
app.use('/registros', registrosRoutes);

module.exports = app;