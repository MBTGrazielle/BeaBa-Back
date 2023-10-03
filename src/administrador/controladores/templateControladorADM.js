require("dotenv").config();
const knex = require("../../db/conexao");
const bcrypt = require("bcrypt");
const moment = require("moment");

const { awsConfig } = require("../../../credenciaisAWS/credenciasAWS");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { v4: uuidv4 } = require("uuid");

// Criar uma instância do serviço S3
const s3 = new S3Client(awsConfig);

const { transporter } = require("../../nodemailer/nodemailer");

const cadastrarTemplates = async (req, res) => {
  const id_usuarioObj = req.params;
  const id_usuario = parseInt(id_usuarioObj.id_usuario, 10);
  const emailObj = req.params;
  const email = emailObj.email;
  
  const { nome_template, objetivo_template, extensao_template } = req.body;

  if (!nome_template || nome_template.length < 3) {
    return res.status(400).json({
      mensagem: "O nome do template é obrigatório",
    });
  }

  if (!objetivo_template || objetivo_template.length < 4) {
    return res.status(400).json({
      mensagem: "O objetivo do template é obrigatório",
    });
  }

  if (!extensao_template) {
    return res.status(400).json({
      mensagem: "A extensão do template é obrigatória",
    });
  }

  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuario });

    let status_template;
    let disponibilidade_template;

    if (usuario[0].tipo_acesso === "ADM") {
      status_template = "ativo";
      disponibilidade_template = true;
    } else if (usuario[0].tipo_acesso === "CAD") {
      status_template = "pendente";
      disponibilidade_template = false;
    }

    const data_criacao_template = moment().format("YYYY-MM-DD HH:mm:ss");

    const template = await knex("BeaBa.templates")
      .insert({
        referencia_usuario: id_usuario,
        data_criacao_template,
        nome_template,
        objetivo_template,
        extensao_template,
        status_template,
        disponibilidade_template,
      })
      .returning("*");

    if (template) {
      const emailHTML = `
        <html>
          <head>
            <style>
              img {
                border-radius: 50%;
                width: 15%;
              }

              strong {
                color: red;
              }
            </style>
          </head>
          <body>
            <h3>Seu arquivo ${nome_template}.${extensao_template} foi cadastrado com sucesso.</h3>
            <div class='logotipo'>
              <img src="https://scontent-for1-1.xx.fbcdn.net/v/t1.6435-9/119046153_975871566219042_7137992106247695417_n.png?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gYbUgPmLOOAAX_r86uz&_nc_ht=scontent-for1-1.xx&oh=00_AfC3zj0rLQvjPM89pZEyjErxiYM818BqIXkMY3jeIRAW_A&oe=65355A49">
            </div>
          </body>
        </html>
      `;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Confirmação de cadastro de Template",
        html: emailHTML,
      });
      res.status(201).json({
        mensagem: "Cadastro realizado com sucesso!",
        status: 201,
      });
    }
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
    });
  }
};

const cadastrarCampos = async (req, res) => {
  const id_templateObj = req.params;
  const id_template = parseInt(id_templateObj.id_template, 10);

  const { nome_campo, tipo_dado_campo } = req.body;

  if (!nome_campo || nome_campo.length < 3) {
    return res.status(400).json({
      mensagem: "O nome do campo é obrigatório",
    });
  }

  if (!tipo_dado_campo) {
    return res.status(400).json({
      mensagem: "O tipo de dado do campo é obrigatório",
    });
  }

  try {

    const campo = await knex("BeaBa.campos")
      .insert({
        referencia_template: id_template,
        nome_campo,
        tipo_dado_campo,
      })
      .returning("*");

    res.status(201).json({
      mensagem: "Cadastro realizado com sucesso!",
      status: 201,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
    });
  }
};

const buscarUsuarios = async (req, res) => {
  const matricula = req.params;

  try {
    const usuario = await knex("BeaBa.usuarios").where(matricula);

    if (usuario.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${usuario.length} resultado${
          usuario.length === 1 ? "" : "s"
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
    email,
    tipo_acesso,
    nome_area,
    cargo,
    squad,
    equipe,
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
        const caminhoImagemAntiga = `${nome_area}/${squad}/img-perfil/${nomeImagemAntiga}`;

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: caminhoImagemAntiga,
        };

        await s3.send(new DeleteObjectCommand(params)); // Excluir a imagem anterior do S3
      }

      const nomeImagem = uuidv4();
      const caminhoImagem = `${nome_area}/${squad}/img-perfil/${nomeImagem}.${imagem_perfil.originalname
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
        email,
        tipo_acesso,
        nome_area,
        cargo,
        squad,
        equipe,
        senha: usuario.senha,
      });
    }

    res.status(200).send({
      mensagem: "Usuário atualizado com sucesso!",
      usuario: {
        imagem_perfil: usuario.imagem_perfil,
        nome_usuario: usuario.nome_usuario,
        email: usuario.email,
        tipo_acesso: usuario.tipo_acesso,
        nome_area: usuario.nome_area,
        cargo: usuario.cargo,
        squad: usuario.squad,
        equipe: usuario.equipe,
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

const deletarUsuarios = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuario }).first();

    if (!usuario) {
      return res.status(404).send({
        mensagem: "Usuário não encontrado",
        status: 404,
      });
    }

    if (usuario.imagem_perfil) {
      // Extrair o nome da imagem do usuário
      const nomeImagem = usuario.imagem_perfil.split("/").pop();

      // Construir o caminho correto para a imagem no S3
      const caminhoImagem = `${usuario.nome_area}/${usuario.squad}/img-perfil/${nomeImagem}`;

      // Configurar os parâmetros de exclusão no S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: caminhoImagem,
      };

      // Excluir a imagem do S3
      await s3.send(new DeleteObjectCommand(params));
    }

    // Agora você pode excluir o registro de usuário no banco de dados
    await knex("BeaBa.usuarios").where({ id_usuario }).del();

    res.status(200).send({
      mensagem: "Usuário removido com sucesso!",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

module.exports = {
  cadastrarTemplates,
  cadastrarCampos,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
};
