const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function gerarSenhaAleatoria() {
  const tamanhoSenha = 10;
  const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let senha = '';
  for (let i = 0; i < tamanhoSenha; i++) {
    const randomIndex = Math.floor(Math.random() * caracteresPermitidos.length);
    senha += caracteresPermitidos.charAt(randomIndex);
  }
  return senha;
}

module.exports = { transporter, gerarSenhaAleatoria };
