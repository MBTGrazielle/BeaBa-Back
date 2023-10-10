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

const {
  transporter,
  gerarSenhaAleatoria,
} = require("../../nodemailer/nodemailer");

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
    usuario.senha = senha ? bcrypt.hashSync(senha, 10) : usuario.senha;

    const s3 = new S3Client(); // Criar uma instância do cliente S3

    if (req.file) {
      const imagem_perfil = req.file;

      if (usuario.imagem_perfil) {
        const nomeImagemAntiga = usuario.imagem_perfil.split("/").pop();
        const caminhoImagemAntiga = `${usuario.nome_area}/${usuario.squad}/${nomeImagemAntiga}`;

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: caminhoImagemAntiga,
        };

        await s3.send(new DeleteObjectCommand(params)); // Excluir a imagem anterior do S3
      }

      const nomeImagem = uuidv4();
      const caminhoImagem = `${usuario.nome_area}/${usuario.squad}/img-perfil${nomeImagem}.${imagem_perfil.originalname
        .split(".")
        .pop()}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: caminhoImagem,
        Body: imagem_perfil.buffer,
      };

      await s3.send(new PutObjectCommand(params)); // Enviar a nova imagem para o S3

      const urlImagem = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${caminhoImagem}`;

      await knex("BeaBa.usuarios").where({ id_usuario }).update({
        imagem_perfil: urlImagem,
        nome_usuario,
        senha: usuario.senha,
      });
    }

    res.status(200).send({
      mensagem: "Usuário atualizado com sucesso!",
      usuario: {
        imagem_perfil: usuario.imagem_perfil,
        nome_usuario: usuario.nome_usuario,
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
  const id_usuarioObj = req.params;
  const id_usuario = parseInt(id_usuarioObj.id_usuario, 10);

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

const esqueceuSenha = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await knex("BeaBa.usuarios").where({ email }).first();

    if (!usuario) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado.", status: 404 });
    }

    // Gerar uma senha nova aleatória
    const novaSenha = gerarSenhaAleatoria();

    // Criptografar a nova senha
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    // Atualizar a senha do usuário no banco de dados
    await knex("BeaBa.usuarios")
      .where({ email })
      .update({ senha: senhaCriptografada });

    const emailHTML = `
  <html>
    <head>
      <style>
       img{
        border-radius:50%;
        width:15%
       }

       strong{
        color:red
       }
      </style>
    </head>
    <body>
    <h3>Segue a senha para utilização do Sistema de Gerenciamento Eletrônico de Templates <h3>
    <p>Senha: <strong>${novaSenha}</strong></p>
    <div class='logotipo'>
    <img src="https://scontent-for1-1.xx.fbcdn.net/v/t1.6435-9/119046153_975871566219042_7137992106247695417_n.png?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gYbUgPmLOOAAX_r86uz&_nc_ht=scontent-for1-1.xx&oh=00_AfC3zj0rLQvjPM89pZEyjErxiYM818BqIXkMY3jeIRAW_A&oe=65355A49">
    </div>
    </body>
  </html>
`;

    // Enviar a nova senha para o e-mail do usuário
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Redefinição de Senha",
      html: emailHTML,
    });

    return res.status(200).json({
      mensagem: "Uma nova senha foi enviada para o seu e-mail.",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensagem: "Ocorreu um erro ao redefinir a senha.",
      status: 500,
    });
  }
};

module.exports = {
  meuPerfil,
  buscarUsuarios,
  atualizarUsuarios,
  deletarImagemPerfil,
  esqueceuSenha,
};
