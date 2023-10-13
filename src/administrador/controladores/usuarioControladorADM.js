require("dotenv").config();
const knex = require("../../db/conexao");
const bcrypt = require("bcrypt");

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

  const senhaHasheada = bcrypt.hashSync(novaSenha, 10);
  novaSenha = senhaHasheada;

  let urlImagem = null;

  if (imagem_perfil) {
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
        senha: novaSenha,
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
    <a href="https://www.queroquero.com.br/"><img src="https://scontent-for1-1.xx.fbcdn.net/v/t1.6435-9/119046153_975871566219042_7137992106247695417_n.png?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gYbUgPmLOOAAX_r86uz&_nc_ht=scontent-for1-1.xx&oh=00_AfC3zj0rLQvjPM89pZEyjErxiYM818BqIXkMY3jeIRAW_A&oe=65355A49"></a>
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
      const hashedSenha = bcrypt.hashSync(senha, 10);
      usuario.senha = hashedSenha;
    }

    const s3 = new S3Client();

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
      const caminhoImagem = `${usuario.nome_area}/${usuario.squad}/img-perfil/${nomeImagem}`;

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


    const novaSenha = gerarSenhaAleatoria();


    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

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
    <a href="https://www.queroquero.com.br/"><img src="https://scontent-for1-1.xx.fbcdn.net/v/t1.6435-9/119046153_975871566219042_7137992106247695417_n.png?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gYbUgPmLOOAAX_r86uz&_nc_ht=scontent-for1-1.xx&oh=00_AfC3zj0rLQvjPM89pZEyjErxiYM818BqIXkMY3jeIRAW_A&oe=65355A49"></a>
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
  cadastrarUsuarios,
  buscarUsuariosMatricula,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  deletarImagemPerfil,
  esqueceuSenha,
};
