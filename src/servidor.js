require('dotenv').config();
const express = require('express');
const rotasUsuariosADM = require('./administrador/rotas/rotasUsuariosADM');
const rotasTemplatesADM = require('./administrador/rotas/rotasTemplatesADM');

const rotasTemplatesMAS = require('./master/rotas/rotasTemplatesMAS');
const rotasUsuariosMAS = require('./master/rotas/rotasUsuariosMAS');

const rotasTemplatesCAD = require('./cadastrador/rotas/rotasTemplatesCAD');
const rotasUsuariosCAD = require('./cadastrador/rotas/rotasUsuariosCAD');

const rotasUploadsADM = require('./administrador/rotas/rotasUploadsADM');

const loginUsuarios = require('./login/rotas/rotaLoginUsuarios')

const esquecerSenha = require('./esquecerSenha/rotas/esquecerSenha')

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(rotasUsuariosADM);
app.use(rotasTemplatesADM);

app.use(rotasTemplatesCAD);
app.use(rotasUsuariosCAD);

app.use(rotasTemplatesMAS);
app.use(rotasUsuariosMAS);

app.use(rotasUploadsADM)

app.use(loginUsuarios)

app.use(esquecerSenha)

module.exports = app;
