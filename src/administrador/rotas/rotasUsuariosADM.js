require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');
const multer = require('multer');

const {
  cadastrarUsuarios,
  login,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  esqueceuSenha,
  deletarImagemPerfil
} = require('../../administrador/controladores/usuarioControladorADM');

const { checkAuth } = require('../middlewares/auth');
const upload = multer();
const rota = Router();

rota.get('/adm/buscarUsuarios/:matricula', buscarUsuarios);
rota.post('/adm/cadastrar',upload.single('imagem_perfil'), cadastrarUsuarios);
rota.post('/adm/login', login);
rota.post('/adm/esqueceuSenha', esqueceuSenha);
rota.patch('/adm/atualizar/:id_usuarios',upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/adm/deletar/:id_usuarios', deletarUsuarios);
rota.delete('/adm/deletarImagem/:id_usuarios', deletarImagemPerfil);

module.exports = rota;