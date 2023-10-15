require('dotenv').config();
const { Router } = require('express');

const {
  esqueceuSenha,
} = require('../controladores/esquecerSenhaControlador');

const { checkAuth } = require('../../middlewares/authADM');
const rota = Router();

rota.post('/esqueceuSenha', esqueceuSenha);

module.exports = rota;
