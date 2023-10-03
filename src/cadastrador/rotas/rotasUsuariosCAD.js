require("dotenv").config();
const conexao = require("../../db/conexao");
const { Router } = require("express");
const multer = require("multer");

const {
  meuPerfil,
  atualizarUsuarios,
  esqueceuSenha,
  deletarImagemPerfil,
} = require("../../cadastrador/controladores/usuarioControladorCAD");

const upload = multer();
const rota = Router();

rota.get("/cad/meuPerfil/:matricula", meuPerfil);
rota.post("/cad/esqueceuSenha", esqueceuSenha);
rota.patch(
  "/cad/atualizar/:id_usuario",
  upload.single("imagem_perfil"),
  atualizarUsuarios
);
rota.delete("/cad/deletarImagem/:id_usuario", deletarImagemPerfil);

module.exports = rota;
