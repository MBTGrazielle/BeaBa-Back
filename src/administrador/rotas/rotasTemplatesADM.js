require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');


const {
  cadastrarTemplates,
  cadastrarCampos,
  inativarTemplate,
} = require('../../administrador/controladores/templateControladorADM');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.post('/adm/cadastrarTemplate/:id_usuario/:email', cadastrarTemplates);
rota.post('/adm/cadastrarCampo/:id_template', cadastrarCampos);
rota.post('/adm/inativarTemplate/:id_template', inativarTemplate);


module.exports = rota;
