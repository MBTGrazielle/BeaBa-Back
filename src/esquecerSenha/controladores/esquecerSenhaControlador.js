require("dotenv").config();
const knex = require("../../db/conexao");
const crypto = require("crypto");

const {
  transporter,
  gerarSenhaAleatoria,
} = require("../../nodemailer/nodemailer");


const esqueceuSenha = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await knex("BeaBa.usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado.", status: 404 });
    }

    const novaSenha = gerarSenhaAleatoria();
    const chave = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);

    const ivBase64 = iv.toString('base64');

    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(chave), iv);

    let senhaCriptografada = cipher.update(novaSenha, 'utf-8', 'hex');
    senhaCriptografada += cipher.final('hex');


    await knex("BeaBa.usuarios")
      .where({ email })
      .update({
        senha: senhaCriptografada,
        chave,
        iv: ivBase64,
      });

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
          <h3>Segue a senha para utilização do Sistema de Gerenciamento Eletrônico de Templates</h3>
          <p>Senha: <strong>${novaSenha}</strong></p>
          <div class='logotipo'>
            <a href="https://www.queroquero.com.br/"><img src="https://media.giphy.com/avatars/lojasqq/C2c7avE93StW.png"></a>
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
