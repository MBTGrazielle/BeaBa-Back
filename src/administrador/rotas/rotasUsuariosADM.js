require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');
const multer = require('multer');

const {
  cadastrarUsuarios,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  esqueceuSenha,
  deletarImagemPerfil
} = require('../../administrador/controladores/usuarioControladorADM');

const { checkAuth } = require('../../middlewares/authADM');
const upload = multer();
const rota = Router();

rota.get('/adm/buscarUsuarios/:matricula',checkAuth , buscarUsuarios);
rota.post('/adm/cadastrar',upload.single('imagem_perfil'), cadastrarUsuarios);
rota.post('/adm/esqueceuSenha', esqueceuSenha);
rota.patch('/adm/atualizar/:id_usuario',upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/adm/deletar/:id_usuario',checkAuth, deletarUsuarios);
rota.delete('/adm/deletarImagem/:id_usuario', deletarImagemPerfil);

module.exports = rota;
