require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');
const multer = require('multer');

const {
  login,
  atualizarUsuarios,
  esqueceuSenha,
  deletarImagemPerfil
} = require('../../cadastrador/controladores/usuarioControladorCAD');

const { checkAuth } = require('../middlewares/auth');
const upload = multer();
const rota = Router();

rota.post('/cad/login', login);
rota.post('/cad/esqueceuSenha', esqueceuSenha);
rota.patch('/cad/atualizar/:id_usuarios',upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/cad/deletarImagem/:id_usuarios', deletarImagemPerfil);

module.exports = rota;
