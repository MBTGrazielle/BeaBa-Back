require('dotenv').config();
const express = require('express');
const rotasUsuariosADM = require('./administrador/rotas/rotasUsuariosADM');
const rotasUsuariosCAD= require('./cadastrador/rotas/rotasUsuariosCAD');

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(rotasUsuariosADM);
app.use(rotasUsuariosCAD);

module.exports = app;
