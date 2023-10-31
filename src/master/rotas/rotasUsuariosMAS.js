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
} = require('../../master/controladores/usuarioControladorMAS');

const { checkAuth } = require('../../middlewares/authADM');
const upload = multer();
const rota = Router();

rota.get('/master/buscarUsuarios/:matricula', buscarUsuariosMatricula);
rota.get('/master/buscarUsuariosId/:id_usuario', buscarUsuarios);
rota.post('/master/cadastrar', upload.single('imagem_perfil'), cadastrarUsuarios);
rota.patch('/master/atualizar/:id_usuario', upload.single('imagem_perfil'), atualizarUsuarios);
rota.delete('/master/deletar/:id_usuario', deletarUsuarios);
rota.delete('/master/deletarImagem/:id_usuario', deletarImagemPerfil);

module.exports = rota;
