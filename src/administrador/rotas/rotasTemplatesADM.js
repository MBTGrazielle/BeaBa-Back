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
  visualizarTemplates,
  deletarCampos,
  invalidarTemplate,
  pendenteTemplate,
  atualizarTemplate,
  buscarTemplates
} = require('../../administrador/controladores/templateControladorADM');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.get('/adm/templates/:status_template/:nome_area/:squad', statusTemplates)
rota.get('/adm/visualizar/:id_template', visualizarTemplates)
rota.get('/adm/buscarTemplates/:nome_area/:squad/:status_template', buscarTemplates)
rota.post('/adm/cadastrarTemplate/:id_usuario', cadastrarTemplates);
rota.post('/adm/cadastrarCampo/:id_template', cadastrarCampos);
rota.patch('/adm/inativarTemplate/:id_template', inativarTemplate);
rota.patch('/adm/pendenteTemplate/:id_template', pendenteTemplate);
rota.patch('/adm/atualizarTemplate/:id_template', atualizarTemplate);
rota.patch('/adm/invalidarTemplate/:id_template/:email/:nome', invalidarTemplate);
rota.patch('/adm/ativarTemplate/:id_template', ativarTemplate);
rota.delete('/adm/deletarTemplate/:id_template', deletarTemplates);
rota.delete('/adm/deletarCampo/:id_template', deletarCampos);

module.exports = rota;
