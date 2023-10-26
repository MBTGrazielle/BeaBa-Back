require("dotenv").config();
const knex = require("../../db/conexao");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const SECRETADM = process.env.SECRETADM;
const SECRETCAD = process.env.SECRETCAD;

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "O e-mail e senha são obrigatórios",
      status: 400,
    });
  }

  // Verifique o formato do email
  const emailRegex =
    /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      mensagem: "Digite um e-mail válido",
      status: 400,
    });
  }

  try {
    const usuario = await knex("BeaBa.usuarios").where("email", email).first();

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Dados inválidos",
        status: 404,
      });
    }

    // Verifique se o usuário está desabilitado
    if (usuario.tipo_acesso === "Desabilitado") {
      return res.status(401).json({
        mensagem: "Usuário sem permissão de acessar ao sistema",
        status: 401,
      });
    }

    const chave = Buffer.from(usuario.chave, 'hex');
    const iv = Buffer.from(usuario.iv, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', chave, iv);

    const senhaCriptografadaBuffer = Buffer.from(usuario.senha, 'hex');
    let senhaDescriptografada = decipher.update(senhaCriptografadaBuffer);
    senhaDescriptografada = Buffer.concat([senhaDescriptografada, decipher.final()]);

    senhaDescriptografada = senhaDescriptografada.toString('utf8');

    if (senha === senhaDescriptografada) {
      let token;
      if (usuario.tipo_acesso === "Administrador") {
        token = jwt.sign({ email: usuario.email }, SECRETADM);
      } else if (usuario.tipo_acesso === "Cadastrador") {
        token = jwt.sign({ email: usuario.email }, SECRETCAD);
      }

      res.status(200).json({
        mensagem: "Login efetuado com sucesso!",
        usuario: {
          id: usuario.id_usuario,
          imagem_perfil: usuario.imagem_perfil,
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
    } else {
      return res.status(401).json({
        mensagem: "Dados inválidos",
        status: 401,
      });
    }
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
    });
  }
};


module.exports = {
  login,
};
