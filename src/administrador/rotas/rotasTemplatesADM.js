require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');


const {
  cadastrarTemplates,
  cadastrarCampos
} = require('../../administrador/controladores/templateControladorADM');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.post('/adm/cadastrarTemplate/:id_usuario/:email', cadastrarTemplates);
rota.post('/adm/cadastrarCampo/:id_template', cadastrarCampos);


module.exports = rota;
