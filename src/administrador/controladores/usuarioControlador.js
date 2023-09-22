require("dotenv").config();
const knex = require("../db/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
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
} = require("../nodemailer/nodemailer");

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
    });
  }

  if (!matricula) {
    return res.status(400).json({
      mensagem: "A matrícula do usuário é obrigatória",
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
      mensagem: "O área do usuário é obrigatório",
    });
  }

  if (!cargo) {
    return res.status(400).json({
      mensagem: "O cargo do usuário é obrigatório",
    });
  }

  if (!squad) {
    return res.status(400).json({
      mensagem: "A squad do usuário é obrigatória",
    });
  }

  if (!equipe) {
    return res.status(400).json({
      mensagem: "A equipe do usuário é obrigatória",
    });
  }

  if (tipo_acesso.length !== 3) {
    return res.status(400).json({
      mensagem: "O tipo de acesso do usuário é obrigatório",
    });
  }

  let novaSenha = gerarSenhaAleatoria();
  let enviarSenha = novaSenha;

  const senhaHasheada = bcrypt.hashSync(novaSenha, 10);
  novaSenha = senhaHasheada;

  let urlImagem = null;

  if (imagem_perfil) {
    const nomeImagem = uuidv4();

    const caminhoImagem = `${nome_area}/${squad}/img-perfil${nomeImagem}.${imagem_perfil.originalname
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
    <h3>Segue a senha para utilização do Sistema de Gerenciamento Eletrônico de Templates <h3>
    <p>Senha: <strong>${enviarSenha}</strong></p>
    <div class='logotipo'>
    <img src="https://scontent-for1-1.xx.fbcdn.net/v/t1.6435-9/119046153_975871566219042_7137992106247695417_n.png?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=gYbUgPmLOOAAX_r86uz&_nc_ht=scontent-for1-1.xx&oh=00_AfC3zj0rLQvjPM89pZEyjErxiYM818BqIXkMY3jeIRAW_A&oe=65355A49">
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

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({
      mensagem: "O e-mail é obrigatório.",
      status: 400,
    });
  }

  if (!senha) {
    return res.status(400).json({
      mensagem: "A senha é obrigatória.",
      status: 400,
    });
  }

  // Verifica se o email é válido
  const emailRegex =
    /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).send({
      mensagem: "Email inválido!",
      status: 400,
    });
  }

  try {
    const usuario = await knex("BeaBa.usuarios").where("email", email).first();

    if (!usuario) {
      return res.status(404).send({
        mensagem: "Dados inválidos",
        status: 404,
      });
    }

    const validPassword = bcrypt.compareSync(senha, usuario.senha);

    if (!validPassword) {
      return res.status(401).send({
        mensagem: "Dados inválidos",
        status: 401,
      });
    }

    const token = jwt.sign({ email: usuario.email }, SECRET);

    res.status(200).send({
      mensagem: "Login efetuado com sucesso!",
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome_usuario,
        matricula: usuario.matricula,
        area: usuario.area,
        email: usuario.email,
        tipo_acesso: usuario.tipo_acesso,
        nome_area: usuario.nome_area,
        cargo: usuario.cargo,
        squad: usuario.squad,
        equipe: usuario.equipe,
      },
      token,
      status: 200,
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
  const { id_usuarios } = req.params;
  let { nome_usuario, email, tipo_acesso, nome_area, cargo, squad, equipe,senha } =
    req.body;

  try {
    const usuarios = await knex("BeaBa.usuarios").where({ id_usuarios });

    if (usuarios.length === 0) {
      return res.status(404).send({
        mensagem: "Usuário não encontrado",
        status: 404,
      });
    }

   

    const usuario = usuarios[0];
    usuario.senha = senha ? bcrypt.hashSync(senha, 10) : usuario.senha

    const s3 = new S3Client(); // Criar uma instância do cliente S3

    if (req.file) {
      const imagem_perfil = req.file;

      if (usuario.imagem_perfil) {
        const nomeImagemAntiga = usuario.imagem_perfil.split("/").pop();
        const caminhoImagemAntiga = `${nome_area}/${squad}/${nomeImagemAntiga}`;

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: caminhoImagemAntiga,
        };

        await s3.send(new DeleteObjectCommand(params)); // Excluir a imagem anterior do S3
      }

      const nomeImagem = uuidv4();
      const caminhoImagem = `${nome_area}/${squad}/img-perfil${nomeImagem}.${imagem_perfil.originalname
        .split(".")
        .pop()}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: caminhoImagem,
        Body: imagem_perfil.buffer,
      };

      await s3.send(new PutObjectCommand(params)); // Enviar a nova imagem para o S3

      const urlImagem = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${caminhoImagem}`;

      await knex("BeaBa.usuarios").where({ id_usuarios }).update({
        imagem_perfil: urlImagem,
        nome_usuario,
        email,
        tipo_acesso,
        nome_area,
        cargo,
        squad,
        equipe,
        senha:usuario.senha
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
  const { id_usuarios } = req.params;

  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuarios }).first();

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
      const caminhoImagem = `${usuario.nome_area}/${usuario.squad}/${nomeImagem}`;

      // Configurar os parâmetros de exclusão no S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: caminhoImagem,
      };

      // Excluir a imagem do S3
      await s3.send(new DeleteObjectCommand(params));
    }

    // Agora você pode excluir o registro de usuário no banco de dados
    await knex("BeaBa.usuarios").where({ id_usuarios }).del();

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

    // Enviar a nova senha para o e-mail do usuário
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Redefinição de Senha",
      text: `Sua nova senha é: ${novaSenha}`,
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
  login,
  buscarUsuarios,
  atualizarUsuarios,
  deletarUsuarios,
  esqueceuSenha,
};
