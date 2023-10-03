require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');

const {
  login,
} = require('../controladores/loginControlador');

const { checkAuth } = require('../../middlewares/authADM');
const rota = Router();

rota.post('/login', login);

module.exports = rota;
