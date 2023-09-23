require('dotenv').config();
const conexao = require('../../db/conexao');
const { Router } = require('express');
const multer = require('multer');

const {
  atualizarUsuarios,
  esqueceuSenha,
  deletarImagemPerfil
} = require('../../cadastrador/controladores/usuarioControladorCAD');

const upload = multer();
const rota = Router();

rota.post('/cad/esqueceuSenha', esqueceuSenha);
rota.patch('/cad/atualizar/:id_usuarios',upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/cad/deletarImagem/:id_usuarios', deletarImagemPerfil);

module.exports = rota;
