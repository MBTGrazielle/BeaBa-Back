require("dotenv").config();
const knex = require("../../db/conexao");
const bcrypt = require("bcrypt");


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
  esqueceuSenha,
};
