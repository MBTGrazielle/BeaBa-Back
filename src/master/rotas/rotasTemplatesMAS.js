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
} = require('../../master/controladores/templateControladorMAS');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.get('/master/templates/:status_template/:nome_area', statusTemplates)
rota.get('/master/visualizar/:id_template', visualizarTemplates)
rota.get('/master/buscarTemplates/:nome_area/:status_template', buscarTemplates)
rota.post('/master/cadastrarTemplate/:id_usuario', cadastrarTemplates);
rota.post('/master/cadastrarCampo/:id_template', cadastrarCampos);
rota.patch('/master/inativarTemplate/:id_template', inativarTemplate);
rota.patch('/master/pendenteTemplate/:id_template', pendenteTemplate);
rota.patch('/master/atualizarTemplate/:id_template', atualizarTemplate);
rota.patch('/master/invalidarTemplate/:id_template/:email/:nome', invalidarTemplate);
rota.patch('/master/ativarTemplate/:id_template', ativarTemplate);
rota.delete('/master/deletarTemplate/:id_template', deletarTemplates);
rota.delete('/master/deletarCampo/:id_template', deletarCampos);

module.exports = rota;
