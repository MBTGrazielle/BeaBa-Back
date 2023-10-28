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
} = require('../../cadastrador/controladores/templateControladorCAD');

const { checkAuth } = require('../../middlewares/authADM');

const rota = Router();

rota.get('/cad/templates/:status_template/:id_usuario', statusTemplates)
rota.get('/cad/visualizar/:id_template', visualizarTemplates)
rota.post('/cad/cadastrarTemplate/:id_usuario', cadastrarTemplates);
rota.post('/cad/cadastrarCampo/:id_template', cadastrarCampos);
rota.delete('/cad/deletarTemplate/:id_template', deletarTemplates);
rota.delete('/cad/deletarCampo/:id_template', deletarCampos);

module.exports = rota;
