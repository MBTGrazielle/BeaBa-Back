require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');


const {
  cadastrarTemplates,
  cadastrarCampos,
  inativarTemplate,
  visualizarTemplates,
  statusTemplates,
  deletarTemplates
} = require('../../administrador/controladores/templateControladorADM');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.get('/adm/templates', visualizarTemplates)
rota.get('/adm/templates/:status_template', statusTemplates)
rota.post('/adm/cadastrarTemplate/:id_usuario', cadastrarTemplates);
rota.post('/adm/cadastrarCampo/:id_template', cadastrarCampos);
rota.post('/adm/inativarTemplate/:id_template', inativarTemplate);
rota.delete('/adm/deletarTemplate/:id_template', deletarTemplates);

module.exports = rota;
