require("dotenv").config();
const knex = require("../../db/conexao");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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

const cadastrarUsuarios = async (req, res) => {
  let {
    nome_usuario,
    matricula,
    email,
    nome_area,
    cargo,
    squad,
    equipe,
    tipo_acesso,
  } = req.body;

  let imagem_perfil = req.file;

  if (!nome_usuario || nome_usuario.length < 3) {
    return res.status(400).json({
      mensagem: "O nome do usuário é obrigatório",
      status: 400
    });
  }

  if (!matricula) {
    return res.status(400).json({
      mensagem: "A matrícula do usuário é obrigatória",
      status: 400
    });
  }

  const matriculaExiste = await knex("BeaBa" + "." + "usuarios").where({
    matricula,
  });

  if (matriculaExiste.length !== 0) {
    return res.status(409).json({
      mensagem: "Esta matrícula já está sendo utilizada",
      status: 409,
    });
  }

  const emailRegex =
    /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).send({
      mensagem: "Email inválido!",
      status: 400,
    });
  }

  const emailExiste = await knex("BeaBa.usuarios").where({ email });

  if (emailExiste.length !== 0) {
    return res.status(409).json({
      mensagem: "Endereço de email já está sendo utilizado",
      status: 409,
    });
  }

  if (!nome_area) {
    return res.status(400).json({
      mensagem: "A área do usuário é obrigatória",
      status: 400
    });
  }

  if (!cargo) {
    return res.status(400).json({
      mensagem: "O cargo do usuário é obrigatório",
      status: 400
    });
  }

  if (!squad) {
    return res.status(400).json({
      mensagem: "A squad do usuário é obrigatória",
      status: 400
    });
  }

  if (!equipe) {
    return res.status(400).json({
      mensagem: "A equipe do usuário é obrigatória",
      status: 400
    });
  }

  if (!tipo_acesso.length || tipo_acesso === '#') {
    return res.status(400).json({
      mensagem: "O tipo de acesso do usuário é obrigatório",
      status: 400
    });
  }

  let novaSenha = gerarSenhaAleatoria();
  let enviarSenha = novaSenha;

  const chave = crypto.randomBytes(16);

  const iv = crypto.randomBytes(16);

  const ivBase64 = iv.toString('base64');

  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(chave), iv);

  let senhaCriptografada = cipher.update(novaSenha, 'utf-8', 'hex');
  senhaCriptografada += cipher.final('hex');

  let urlImagem = null;

  if (imagem_perfil) {
    const nomeImagem = uuidv4();

    const caminhoImagem = `img-perfil/${nome_area}/${squad}/${nomeImagem}.${imagem_perfil.originalname
      .split(".")
      .pop()}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: caminhoImagem,
      Body: imagem_perfil.buffer,
    };

    await s3.send(new PutObjectCommand(params));

    urlImagem = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${caminhoImagem}`;
  }

  try {
    const usuario = await knex("BeaBa.usuarios")
      .insert({
        imagem_perfil: urlImagem,
        nome_usuario,
        matricula,
        email,
        tipo_acesso,
        nome_area,
        cargo,
        squad,
        equipe,
        chave,
        iv: ivBase64,
        senha: senhaCriptografada,
      })
      .returning("*");

    if (usuario) {
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
    <h1>Olá, ${nome_usuario}</h1>
    <h3>Segue a senha para utilização do Sistema de Gerenciamento Eletrônico de Templates <h3>
    <p>Senha: <strong>${enviarSenha}</strong></p>
    <div class='logotipo'>
    <a href="https://www.queroquero.com.br/"><img src="https://media.giphy.com/avatars/lojasqq/C2c7avE93StW.png"></a>
    </div>
    </body>
  </html>
`;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Sistema de Gerenciamento Eletrônico de Templates",
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

const buscarUsuariosMatricula = async (req, res) => {
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

const atualizarUsuarios = async (req, res) => {
  const { id_usuario } = req.params;

  let {
    nome_usuario,
    email,
    matricula,
    tipo_acesso,
    nome_area,
    cargo,
    squad,
    equipe,
    senha,
  } = req.body;

  let urlImagem = '';

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
      const chave = usuario.chave;
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(chave), iv);

      let senhaCriptografada = cipher.update(senha, 'utf-8', 'hex');
      senhaCriptografada += cipher.final('hex');


      await knex("BeaBa.usuarios").where({ id_usuario }).update({
        iv: iv.toString('base64'),
        senha: senhaCriptografada,
      });

      usuario.senha = senhaCriptografada;
    }

    const s3 = new S3Client();

    if (req.file) {
      const imagem_perfil = req.file;

      const nomeImagem = uuidv4();
      const caminhoImagem = `img-perfil/${nome_area}/${squad}/${nomeImagem}.${imagem_perfil.originalname
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
        const caminhoImagemAntiga = `img-perfil/${nome_area}/${squad}/${nomeImagemAntiga}`;

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
      email,
      matricula,
      tipo_acesso,
      nome_area,
      cargo,
      squad,
      equipe,
      senha: usuario.senha,
    });

    res.status(200).send({
      mensagem: "Usuário atualizado com sucesso!",
      usuario: {
        imagem_perfil: urlImagem,
        nome_usuario: nome_usuario,
        email: email,
        matricula: matricula,
        tipo_acesso: tipo_acesso,
        nome_area: nome_area,
        cargo: cargo,
        squad: squad,
        equipe: equipe,
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
      const caminhoImagem = `img-perfil/${usuario.nome_area}/${usuario.squad}/${nomeImagem}`;

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
      const caminhoImagem = `img-perfil/${usuario.nome_area}/${usuario.squad}/${nomeImagem}`;

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
  cadastrarUsuarios,
  buscarUsuariosMatricula,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  deletarImagemPerfil,
};
