require('dotenv').config();
const express = require('express');
const rotasUsuarios = require('./administrador/rotas/rotasUsuarios');
const index = require('./administrador/rotas/index');

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(index);
app.use(rotasUsuarios);

module.exports = app;
