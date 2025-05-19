const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const registrosSaudeRoutes = require('./routes/registrosSaude');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/registros-saude', registrosSaudeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
