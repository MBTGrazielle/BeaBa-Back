require("dotenv").config();
const knex = require("../../db/conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRETADM = process.env.SECRETADM;
const SECRETCAD = process.env.SECRETCAD;

// const login = async (req, res) => {
//   const { email, senha } = req.body;

//   try {
//     const usuario = await knex("BeaBa.usuarios").where("email", email).first();

//     if (!usuario) {
//       return res.status(404).json({
//         mensagem: "Dados inválidos",
//         status: 404,
//       });
//     }

//       const validPassword = bcrypt.compareSync(senha, usuario.senha);

//       if (!validPassword) {
//         return res.status(401).json({
//           mensagem: "Dados inválidos",
//           status: 401,
//         });
//       }

//       const token = jwt.sign({ email: usuario.email }, SECRETADM);

//       res.status(200).json({
//         mensagem: "Login efetuado com sucesso!",
//         usuario: {
//           id: usuario.id_usuario,
//           nome: usuario.nome_usuario,
//           matricula: usuario.matricula,
//           area: usuario.area,
//           email: usuario.email,
//           tipo_acesso: usuario.tipo_acesso,
//           nome_area: usuario.nome_area,
//           cargo: usuario.cargo,
//           squad: usuario.squad,
//           equipe: usuario.equipe,
//         },
//         token,
//         status: 200,
//       });
//   } catch (err) {
//     res.status(500).json({
//       mensagem: err.message,
//     });
//   }
// };

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({
      mensagem: 'O e-mail e senha são obrigatórios',
      status: 400,
    });
  }

  // Verifica se o email é válido
  const emailRegex =
    /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      mensagem: 'Digite um e-mail válido',
      status: 400,
    });
  }

  try {
    const usuario = await knex('BeaBa.usuarios').where('email', email).first();

    if (!usuario) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado',
        status: 404,
      });
    }

    const validPassword = bcrypt.compareSync(senha, usuario.senha);

    if (!validPassword) {
      return res.status(401).json({
        mensagem: 'Dados inválidos',
        status: 401,
      });
    }

    const token = jwt.sign({ email: usuario.email }, SECRETADM);

    res.status(200).json({
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

module.exports = {
  login,
};
