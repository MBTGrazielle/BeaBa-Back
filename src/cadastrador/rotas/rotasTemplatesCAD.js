require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');


const {
  cadastrarTemplates,
  cadastrarCampos,
  statusTemplates,
  deletarTemplates,
  visualizarTemplates,
  deletarCampos,
  atualizarTemplate,
  buscarTemplates,
  buscarTemplatesPendentes,
  verTabelaUploads,
} = require('../../cadastrador/controladores/templateControladorCAD');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.get('/cad/templates/:status_template/:nome_area/:squad', statusTemplates)
rota.get('/cad/visualizar/:id_template', visualizarTemplates)
rota.get('/cad/verTabelas/:id_usuario', verTabelaUploads)
rota.get('/cad/buscarTemplates/:nome_area/:squad/:status_template', buscarTemplates)
rota.get('/cad/buscarTemplates/:id_usuario/:status_template', buscarTemplatesPendentes)
rota.post('/cad/cadastrarTemplate/:id_usuario', cadastrarTemplates);
rota.post('/cad/cadastrarCampo/:id_template', cadastrarCampos);
rota.patch('/cad/atualizarTemplate/:id_template', atualizarTemplate);
rota.delete('/cad/deletarTemplate/:id_template', deletarTemplates);
rota.delete('/cad/deletarCampo/:id_template', deletarCampos);

module.exports = rota;
