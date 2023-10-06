require('dotenv').config();
const express = require('express');
const rotasUsuariosADM = require('./administrador/rotas/rotasUsuariosADM');
const rotasTemplatesADM = require('./administrador/rotas/rotasTemplatesADM');
const rotasUsuariosCAD= require('./cadastrador/rotas/rotasUsuariosCAD');
const loginUsuarios=require('./login/rotas/rotaLoginUsuarios')

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(rotasUsuariosADM);
app.use(rotasTemplatesADM);
app.use(rotasUsuariosCAD);
app.use(loginUsuarios)

module.exports = app;
