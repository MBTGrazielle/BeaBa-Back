require('dotenv').config();
const conexao = require('../db/conexao');
const { Router } = require('express');
const multer = require('multer');

const {
  cadastrarUsuarios,
  login,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  esqueceuSenha,
} = require('../../administrador/controladores/usuarioControlador');

const { checkAuth } = require('../middlewares/auth');
const upload = multer();
const rota = Router();

rota.get('/buscarUsuarios/:matricula', buscarUsuarios);
rota.post('/cadastrar',upload.single('imagem_perfil'), cadastrarUsuarios);
rota.post('/login', login);
rota.post('/esqueceuSenha', esqueceuSenha);
rota.patch('/atualizar/:id_usuarios',upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/deletar/:id_usuarios', deletarUsuarios);

module.exports = rota;
