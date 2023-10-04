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
      mensagem: "Digite uma extensão válida",
    });
  }

  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuario });

    let status_template;
  
    if (usuario[0].tipo_acesso === "ADM") {
      status_template = "ativo";
      
    } else if (usuario[0].tipo_acesso === "CAD") {
      status_template = "pendente";
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
            <h3>O template ${nome_template} com o formato esperado ${extensao_template} foi cadastrado com sucesso.</h3>
            <div class='logotipo'>
              <a href="https://www.queroquero.com.br/"><img src="https://scontent-for1-1.xx.fbcdn.net/v/t1.6435-9/119046153_975871566219042_7137992106247695417_n.png?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gYbUgPmLOOAAX_r86uz&_nc_ht=scontent-for1-1.xx&oh=00_AfC3zj0rLQvjPM89pZEyjErxiYM818BqIXkMY3jeIRAW_A&oe=65355A49"></a>
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

const inativarTemplate = async (req, res) => {
  const id_templateObj = req.params;
  const id_template = parseInt(id_templateObj.id_template, 10);
  const referencia_template = id_template;

  try {
    const template = await knex("BeaBa.templates").where({ id_template }).update({
      status_template:'inativo',
    });

    res.status(200).json({ mensagem: "Template inativado com sucesso",status:200 });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

module.exports = {
  cadastrarTemplates,
  cadastrarCampos,
  inativarTemplate,
};
