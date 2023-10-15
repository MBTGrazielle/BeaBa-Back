require('dotenv').config();
const { Router } = require('express');
const multer = require('multer');

const {
  cadastrarUsuarios,
  buscarUsuariosMatricula,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  deletarImagemPerfil
} = require('../../administrador/controladores/usuarioControladorADM');

const { checkAuth } = require('../../middlewares/authADM');
const upload = multer();
const rota = Router();

rota.get('/adm/buscarUsuarios/:matricula', buscarUsuariosMatricula);
rota.get('/adm/buscarUsuariosId/:id_usuario', buscarUsuarios);
rota.post('/adm/cadastrar', upload.single('imagem_perfil'), cadastrarUsuarios);
rota.patch('/adm/atualizar/:id_usuario', upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/adm/deletar/:id_usuario', deletarUsuarios);
rota.delete('/adm/deletarImagem/:id_usuario', deletarImagemPerfil);

module.exports = rota;
