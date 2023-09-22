const router = require('express').Router();

router.get('/', (request, response) => {
  response.send({
    versao: '1.0.0-WooW',
    titulo: 'Grupo-woow-Leads-Api',
    banco: 'Postgres',
    bancoDados: 'Grupo WooW',
  });
});

module.exports = router;
