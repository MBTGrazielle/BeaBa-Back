<b><h1>Projeto BeaBa</h1>

## DESCRIÇÃO:

<div><br>
<strong>Versão: </strong> 1.0.0<br>
<strong>Repositório: </strong> https://github.com/MBTGrazielle/BeaBa-Back<br>
<strong>Banco de Dados: </strong> Postgresql<br>
<strong>Nome do Banco/Schema: </strong> Postgresql/BeaBa<br><br>
</div>
<br>

## TECNOLOGIAS E PACOTES UTILIZADOS:

<br>

| <div align="center">TECNOLOGIAS | <div align="center"> DESCRIÇÃO                          | <div align="center">LINK                                                     |
| ------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| <div align="center">Bootstrap   | <div align="center">Framework de front-end              | <div align="center"> [ver](https://getbootstrap.com/)                        |
| <div align="center">Canva       | <div align="center">Ferramenta de design gráfico        | <div align="center"> [ver](https://www.canva.com/)                           |
| <div align="center">CSS         | <div align="center">Folhas de Estilo em Cascata         | <div align="center"> [ver](https://developer.mozilla.org/pt-BR/docs/Web/CSS) |
| <div align="center">Git/GitHub  | <div align="center">Controle de versão e plataforma     | <div align="center"> [ver](https://github.com/)                              |
| <div align="center">HTML        | <div align="center">Linguagem de Marcação de Hipertexto | <div align="center">[ver](https://developer.mozilla.org/pt-BR/docs/Web/HTML) |
| <div align="center">Insomnia    | <div align="center">Cliente REST para testar APIs       | <div align="center">[ver](https://insomnia.rest/)                            |
| <div align="center">JavaScript  | <div align="center">Linguagem de programação            | <div align="center">[ver](https://www.javascript.com/)                       |
| <div align="center">Node.js     | <div align="center">Execução JavaScript no servidor     | <div align="center"> [ver](https://nodejs.org/en/)                           |
| <div align="center">Python      | <div align="center">Linguagem de programação            | <div align="center">[ver](https://www.python.org/)                           |
| <div align="center">Postman     | <div align="center">Plataforma para teste de APIs       | <div align="center">[ver](https://www.postman.com/)                          |
| <div align="center">VScode      | <div align="center">Editor de código fonte              | <div align="center">[ver](https://code.visualstudio.com/)                    |

<br>

| <div align="center">PACOTES           | <div align="center">DESCRIÇÃO                                            | <div align="center">LINK                                                    |
| ------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| <div align="center">Aws-sdk/client-s3 | <div align="center">Interage com o serviço Amazon S3 - Upload de imagens | <div align="center">[ver](https://www.npmjs.com/package/@aws-sdk/client-s3) |
| <div align="center">Cors              | <div align="center">Middleware para habilitar CORS                       | <div align="center">[ver](https://www.npmjs.com/package/cors)               |
| <div align="center">Dotenv            | <div align="center">Carregamento de variáveis de ambiente                | <div align="center">[ver](https://www.npmjs.com/package/dotenv)             |
| <div align="center">Multer            | <div align="center">Middleware para upload de arquivos                   | <div align="center"> [ver](https://www.npmjs.com/package/multer)            |
| <div align="center">Nodemon           | <div align="center">Monitor para reiniciar o servidor                    | <div align="center">[ver](https://www.npmjs.com/package/nodemon)            |

<br>

| <div align="center">BIBLIOTECAS    | <div align="center">DESCRIÇÃO                                                                      | <div align="center">LINK                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| <div align="center">Bcrypt         | <div align="center">Biblioteca de criptografia                                                     | <div align="center">[ver](https://www.npmjs.com/package/bcrypt)          |
| <div align="center">Jsonwebtoken   | <div align="center">Implementação de tokens JWT                                                    | <div align="center">[ver](https://www.npmjs.com/package/jsonwebtoken)    |
| <div align="center">Knex           | <div align="center">Biblioteca que funciona como um query builder para bancos de dados relacionais | <div align="center">[ver](https://knexjs.org/)                           |
| <div align="center">Moment         | <div align="center">Utilizada para manipulação, formatação e análise de datas e horários           | <div align="center">[ver](https://www.npmjs.com/package/moment)          |
| <div align="center">Nodemailer     | <div align="center">Permite enviar e-mails de forma fácil e flexível                               | <div align="center">[ver](https://www.npmjs.com/package/nodemailer)      |
| <div align="center">Pandas         | <div align="center">Manipulação e análise de dados tabulares                                       | <div align="center">[ver](https://pandas.pydata.org/docs/)               |
| <div align="center">Psycopg2       | <div align="center">Conectar e interagir com bancos de dados PostgreSQL                            | <div align="center">[ver](https://pypi.org/project/psycopg2/)            |
| <div align="center">Remove-accents | <div align="center">Cliente PostgreSQL para Node.js                                                | <div align="center"> [ver](https://www.npmjs.com/package/remove-accents) |
| <div align="center">Uuid           | <div align="center">Identificador único universalmente                                             | <div align="center"> [ver](https://www.npmjs.com/package/uuid)           |

<br>
| <div align="center">BIBLIOTECAS    | <div align="center">DESCRIÇÃO                                                                      | <div align="center">LINK                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| <div align="center">Child_process         | <div align="center">Módulo integrado para executar scripts em Python                                                     | <div align="center">[ver](https://www.npmjs.com/package/bcrypt)          |

<br><br>

## ARQUITETURA MVC

```
📁BeaBa-Back
```

<br><br>

## ​PARA REALIZAR A INSTALAÇÃO NO SEU COMPUTADOR:

1. Primeiro é necessário clonar o seguinte repositório:

   ```bash
   $ git clone https://github.com/MBTGrazielle/BeaBa-Back.git
   ```

2. Entre na seguinte pasta:

   ```bash
   $ cd BeaBa-Back/
   ```

3. Para prosseguir, é necessário atualizar o repositório local, baixar as dependências e iniciar o servidor:

   ```bash
    $ npm run dev
   ```

<br><br>

## ​ROTAS:

Aqui estão as rotas disponíveis na aplicação:<br><br>

ROTAS ADMINISTRADOR - USUÁRIOS
<br>

| <div align="center"> Arquivo            | <div align="center"> HTTP  | <div align="center"> Autenticação | <div align="center"> ENDPOINTS                        | <div align="center">DESCRIÇÃO                                 |
| :-------------------------------------- | :------------------------- | :-------------------------------- | :---------------------------------------------------- | ------------------------------------------------------------- |
| <div align="center">rotasUsuariosADM.js | <div align="center">POST   | <div align="center">❌            | <div align="center">`/adm/cadastrar`                  | <div align="center">Cadastra um novo usuário                  |
| <div align="center">rotasUsuariosADM.js | <div align="center">POST   | <div align="center">❌            | <div align="center">`/login`                          | <div align="center">Login do usuário                          |
| <div align="center">rotasUsuariosADM.js | <div align="center">POST   | <div align="center">❌            | <div align="center">`/adm/esqueceuSenha`              | <div align="center">Recuperação de senha do usuário           |
| <div align="center">rotasUsuariosADM.js | <div align="center">GET    | <div align="center">✔️checkAuth   | <div align="center">`/adm/buscarUsuarios/:matricula`  | <div align="center">Busca usuário por matrícula               |
| <div align="center">rotasUsuariosADM.js | <div align="center">PATCH  | <div align="center">❌            | <div align="center">`/adm/atualizar/:id_usuarios`     | <div align="center">Atualiza usuário através do ID do usuário |
| <div align="center">rotasUsuariosADM.js | <div align="center">DELETE | <div align="center">✔️checkAuth   | <div align="center">`/adm/deletar/:id_usuarios`       | <div align="center">Deleta usuário através do ID do usuário   |
| <div align="center">rotasUsuariosADM.js | <div align="center">DELETE | <div align="center">❌            | <div align="center">`/adm/deletarImagem/:id_usuarios` | <div align="center">Deleta a imagem de perfil do usuário      |

<br>
ROTAS CADASTRADOR - USUÁRIOS
<br>

| <div align="center"> Arquivo            | <div align="center"> HTTP  | <div align="center"> Autenticação | <div align="center"> ENDPOINTS                        | <div align="center">DESCRIÇÃO                                 |
| :-------------------------------------- | :------------------------- | :-------------------------------- | :---------------------------------------------------- | ------------------------------------------------------------- |
| <div align="center">rotasUsuariosCAD.js | <div align="center">POST   | <div align="center">❌            | <div align="center">`/login`                          | <div align="center">Login do usuário                          |
| <div align="center">rotasUsuariosCAD.js | <div align="center">POST   | <div align="center">❌            | <div align="center">`/cad/esqueceuSenha`              | <div align="center">Recuperação de senha do usuário           |
| <div align="center">rotasUsuariosCAD.js | <div align="center">PATCH  | <div align="center">❌            | <div align="center">`/cad/atualizar/:id_usuarios`     | <div align="center">Atualiza usuário através do ID do usuário |
| <div align="center">rotasUsuariosCAD.js | <div align="center">DELETE | <div align="center">❌            | <div align="center">`/cad/deletarImagem/:id_usuarios` | <div align="center">Deleta a imagem de perfil do usuário      |
