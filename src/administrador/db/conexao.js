require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT,
  },
});

knex
  .raw('SELECT 1')
  .then(() => {
    console.log('Banco de dados conectado!');
  })
  .catch(error => {
    console.log(error.message);
  });

module.exports = knex;
