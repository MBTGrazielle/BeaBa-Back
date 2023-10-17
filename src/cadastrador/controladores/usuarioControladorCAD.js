require("dotenv").config();
const knex = require("../../db/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const removeAccents = require("remove-accents");

const { awsConfig } = require("../../../credenciaisAWS/credenciasAWS");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { v4: uuidv4 } = require("uuid");

// Criar uma instância do serviço S3
const s3 = new S3Client(awsConfig);

const meuPerfil = async (req, res) => {
  const matricula = req.params;

  try {
    const usuario = await knex("BeaBa.usuarios").where(matricula);

    if (usuario.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${usuario.length} resultado${usuario.length === 1 ? "" : "s"
          }.`,
        usuario,
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: "Nenhum resultado foi encontrado para a sua busca.",
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const atualizarUsuarios = async (req, res) => {
  const { id_usuario } = req.params;
  let {
    nome_usuario,
    senha,
    nome_area,
    squad
  } = req.body;

  try {
    const usuarios = await knex("BeaBa.usuarios").where({ id_usuario });

    if (usuarios.length === 0) {
      return res.status(404).send({
        mensagem: "Usuário não encontrado",
        status: 404,
      });
    }

    const usuario = usuarios[0];
    if (senha && senha !== usuario.senha) {
      const hashedSenha = bcrypt.hashSync(senha, 10);
      usuario.senha = hashedSenha;
    }

    const s3 = new S3Client(); // Criar uma instância do cliente S3

    if (req.file) {
      const imagem_perfil = req.file;

      const nomeImagem = uuidv4();
      const caminhoImagem = `${nome_area}/${squad}/img-perfil/${nomeImagem}.${imagem_perfil.originalname
        .split(".")
        .pop()}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: caminhoImagem,
        Body: imagem_perfil.buffer,
      };

      await s3.send(new PutObjectCommand(params));

      if (usuario.imagem_perfil) {
        const nomeImagemAntiga = usuario.imagem_perfil.split("/").pop();
        const caminhoImagemAntiga = `${nome_area}/${squad}/img-perfil/${nomeImagemAntiga}`;

        const paramsAntigos = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: caminhoImagemAntiga,
        };

        await s3.send(new DeleteObjectCommand(paramsAntigos));
      }

      urlImagem = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${caminhoImagem}`;
    } else {
      urlImagem = usuario.imagem_perfil
    }

    await knex("BeaBa.usuarios").where({ id_usuario }).update({
      imagem_perfil: urlImagem,
      nome_usuario,
      senha: usuario.senha,
    });

    res.status(200).send({
      mensagem: "Usuário atualizado com sucesso!",
      usuario: {
        imagem_perfil: urlImagem,
        nome_usuario: nome_usuario,
      },
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

const buscarUsuarios = async (req, res) => {
  const { id_usuario } = req.params;


  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuario });

    if (usuario.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${usuario.length} resultado${usuario.length === 1 ? "" : "s"
          }.`,
        usuario,
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: "Nenhum resultado foi encontrado para a sua busca.",
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const deletarImagemPerfil = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuario }).first();

    if (!usuario) {
      return res.status(404).send({
        mensagem: "Usuário não encontrado",
        status: 404,
      });
    }

    // Verifique se o usuário possui uma imagem de perfil para excluir
    if (usuario.imagem_perfil) {
      // Extrair o nome da imagem do usuário
      const nomeImagem = usuario.imagem_perfil.split("/").pop();

      // Construir o caminho correto para a imagem no S3
      const caminhoImagem = `${usuario.nome_area}/${usuario.squad}/${nomeImagem}`;

      // Configurar os parâmetros de exclusão no S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: caminhoImagem,
      };

      // Excluir a imagem do S3
      await s3.send(new DeleteObjectCommand(params));

      // Atualize o campo imagem_perfil para null no banco de dados
      await knex("BeaBa.usuarios")
        .where({ id_usuario })
        .update({ imagem_perfil: null });

      res.status(200).send({
        mensagem: "Imagem de perfil deletada com sucesso!",
        status: 200,
      });
    } else {
      // Se o usuário não possui uma imagem de perfil, apenas envie uma resposta de sucesso
      res.status(200).send({
        mensagem: "Usuário não possui uma imagem de perfil para deletar.",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

module.exports = {
  meuPerfil,
  buscarUsuarios,
  atualizarUsuarios,
  deletarImagemPerfil,
};
