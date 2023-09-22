const servidor = require('./servidor');
require('dotenv').config();

servidor.listen(3008, () => console.log(`Sistema de Gerenciamento Eletrônico de Templates - BeaBa`));
