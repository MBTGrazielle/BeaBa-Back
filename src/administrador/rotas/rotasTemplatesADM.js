require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');


const {
  cadastrarTemplates,
  cadastrarCampos,
  inativarTemplate,
  ativarTemplate,
  statusTemplates,
  deletarTemplates,
  visualizarTemplates
} = require('../../administrador/controladores/templateControladorADM');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.get('/adm/templates/:status_template', statusTemplates)
rota.get('/adm/visualizar/:id_template', visualizarTemplates)
rota.post('/adm/cadastrarTemplate/:id_usuario', cadastrarTemplates);
rota.post('/adm/cadastrarCampo/:id_template', cadastrarCampos);
rota.patch('/adm/inativarTemplate/:id_template', inativarTemplate);
rota.patch('/adm/ativarTemplate/:id_template', ativarTemplate);
rota.delete('/adm/deletarTemplate/:id_template', deletarTemplates);

module.exports = rota;
