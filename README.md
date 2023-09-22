<b><h1>Projeto BeaBa</h1>

## DESCRIÇÃO:

<div><br>
<strong>Versão: </strong> 1.0.0<br>
<strong>Repositório: </strong> https://github.com/MBTGrazielle/BeaBa-Back<br>
<strong>Banco de Dados: </strong> Postgresql<br>
<strong>Nome do Banco: </strong> Postgresql - BeaBa<br><br>
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
| <div align="center">Remove-accents | <div align="center">Cliente PostgreSQL para Node.js                                                | <div align="center"> [ver](https://www.npmjs.com/package/remove-accents) |
| <div align="center">Uuid           | <div align="center">Identificador único universalmente                                             | <div align="center"> [ver](https://www.npmjs.com/package/uuid)           |

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

<!-- Aqui estão algumas das rotas disponíveis na nossa aplicação:<br><br>
ROTAS ADMINISTRADOR
<br>

| <div align="center"> Arquivo       | <div align="center"> HTTP   | <div align="center"> Autenticação   | <div align="center"> ENDPOINTS                       | <div align="center">DESCRIÇÃO                                                                                                         |
| :--------------------------------- | :-------------------------- | :---------------------------------- | :--------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| <div align="center">bannerAdm.js   | <div align="center">POST    | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarBanner/:usuario_id`   | <div align="center">Cadastra o banner por usuario_id                                                                                  |
| <div align="center">footerAdm.js   | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarFooter/:usuario_id`   | <div align="center">Cadastra o footer por usuario_id                                                                                  |
| <div align="center">geralAdm.js    | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarQtdHome/:usuario_id`  | <div align="center">Cadastra a quantidade de artigos,fotografias e histórias na Home / Cadastra a cor da letra e background de botões |
| <div align="center">headerAdm.js   | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarHeader/:usuario_id`   | <div align="center">Cadastra o header por usuario_id                                                                                  |
| <div align="center">indexRoutes.js | <div align="center"> GET    | <div align="center">❌              | <div align="center">                                 | <div align="center">Inicial com descrição do produto                                                                                  |
| <div align="center">listrasAdm.js  | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarListras/:usuario_id`  | <div align="center">Cadastra as listras por usuario_id                                                                                |
| <div align="center">section1Adm.js | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarSection1/:usuario_id` | <div align="center">Cadastra a section1 por usuario_id                                                                                |
| <div align="center">section2Adm.js | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarSection2/:usuario_id` | <div align="center">Cadastra a section2 por usuario_id                                                                                |
| <div align="center">section3Adm.js | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarSection3/:usuario_id` | <div align="center">Cadastra a section3 por usuario_id                                                                                |
| <div align="center">sobreAdm.js    | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarSobre/:usuario_id`    | <div align="center">Cadastra o sobre por usuario_id                                                                                   |
| <div align="center">usuarioAdm.js  | <div align="center"> POST   | <div align="center">✔️checkAuthWooW | <div align="center">`/cadastrarUsuarios`             | <div align="center">Cadastra usuários do blog                                                                                         |
| <div align="center">usuarioAdm.js  | <div align="center"> GET    | <div align="center">✔️checkAuthWooW | <div align="center">`/allUsuarios/`                  | <div align="center">Retorna todos os usuários do blog                                                                                 |
| <div align="center">usuarioAdm.js  | <div align="center"> GET    | <div align="center">✔️checkAuthWooW | <div align="center">`/filtroAvancado/`               | <div align="center">Retorna resultado do filtro avançado de usuários do blog                                                          |
| <div align="center">usuarioAdm.js  | <div align="center"> DELETE | <div align="center">✔️checkAuthWooW | <div align="center">`/deletarUsuarios/:usuario_id`   | <div align="center">Deleta usuário do blog                                                                                            |

<br><br>
ROTAS CLIENTE
<br>

| <div align="center"> Arquivo             | <div align="center"> HTTP  | <div align="center"> Autenticação     | <div align="center"> ENDPOINTS                          | <div align="center">DESCRIÇÃO                                                                                                         |
| :--------------------------------------- | :------------------------- | :------------------------------------ | :------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| <div align="center">artigosClient.js     | <div align="center">POST   | <div align="center">✔️checkAuthClient | <div align="center">`/cadastrarArtigos/:usuario_id`     | <div align="center">Cadastra o artigo por usuario_id                                                                                  |
| <div align="center">artigosClient.js     | <div align="center">GET    | <div align="center">❌                | <div align="center">`/buscarArtigos/:usuario_id`        | <div align="center">Retorna resultado do filtro avançado de artigos por usuario_id                                                    |
| <div align="center">artigosClient.js     | <div align="center">GET    | <div align="center">❌                | <div align="center">`/allArtigos/:usuario_id`           | <div align="center">Retorna todos os artigos por usuario_id em ordem descrescente (data_criacao)                                      |
| <div align="center">artigosClient.js     | <div align="center">PATCH  | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarArtigos/:usuario_id`     | <div align="center">Atualiza artigo por usuario_id                                                                                    |
| <div align="center">artigosClient.js     | <div align="center">DELETE | <div align="center">✔️checkAuthClient | <div align="center">`/deletarArtigos/:usuario_id`       | <div align="center">Deleta artigo por usuario_id                                                                                      |
| <div align="center">bannerClient.js      | <div align="center">GET    | <div align="center">❌                | <div align="center">`/allBanner/:usuario_id`            | <div align="center">Retorna o banner por usuario_id                                                                                   |
| <div align="center">bannerClient.js      | <div align="center">PATCH  | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarBanner/:usuario_id`      | <div align="center">Atualiza o banner por usuario_id                                                                                  |
| <div align="center">footerClient.js      | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allFooter/:usuario_id`            | <div align="center">Retorna o footer por usuario_id                                                                                   |
| <div align="center">footerClient.js      | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarFooter/:usuario_id`      | <div align="center">Atualiza o footer por usuario_id                                                                                  |
| <div align="center">fotografiasClient.js | <div align="center">POST   | <div align="center">✔️checkAuthClient | <div align="center">`/cadastrarFotografias/:usuario_id` | <div align="center">Cadastra a fotografia por usuario_id                                                                              |
| <div align="center">fotografiasClient.js | <div align="center">GET    | <div align="center">❌                | <div align="center">`/buscarFotografias/:usuario_id`    | <div align="center">Retorna resultado do filtro avançado de fotografias por usuario_id                                                |
| <div align="center">fotografiasClient.js | <div align="center">GET    | <div align="center">❌                | <div align="center">`/allFotografias/:usuario_id`       | <div align="center">Retorna todas as fotografias por usuario_id em ordem descrescente (data_criacao)                                  |
| <div align="center">fotografiasClient.js | <div align="center">PATCH  | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarFotografias/:usuario_id` | <div align="center">Atualiza fotografia por usuario_id                                                                                |
| <div align="center">fotografiasClient.js | <div align="center">DELETE | <div align="center">✔️checkAuthClient | <div align="center">`/deletarFotografias/:usuario_id`   | <div align="center">Deleta fotografia por usuario_id                                                                                  |
| <div align="center">geralClient.js       | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allQtdHome/:usuario_id`           | <div align="center">Retorna a quantidade de artigos,fotografias e histórias na Home / Retorna a cor da letra e background de botões   |
| <div align="center">geralClient.js       | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarQtdHome/:usuario_id`     | <div align="center">Atualiza a quantidade de artigos,fotografias e histórias na Home / Atualiza a cor da letra e background de botões |
| <div align="center">headerClient.js      | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allHeader/:usuario_id`            | <div align="center">Retorna o header por usuario_id                                                                                   |
| <div align="center">headerClient.js      | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarHeader/:usuario_id`      | <div align="center">Atualiza o header por usuario_id                                                                                  |
| <div align="center">historiasClient.js   | <div align="center">POST   | <div align="center">✔️checkAuthClient | <div align="center">`/cadastrarHistorias/:usuario_id`   | <div align="center">Cadastra a história por usuario_id                                                                                |
| <div align="center">historiasClient.js   | <div align="center">GET    | <div align="center">❌                | <div align="center">`/buscarHistorias/:usuario_id`      | <div align="center">Retorna resultado do filtro avançado de histórias por usuario_id                                                  |
| <div align="center">historiasClient.js   | <div align="center">GET    | <div align="center">❌                | <div align="center">`/allHistorias/:usuario_id`         | <div align="center">Retorna todas as histórias por usuario_id em ordem descrescente (data_criacao)                                    |
| <div align="center">historiasClient.js   | <div align="center">PATCH  | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarHistorias/:usuario_id`   | <div align="center">Atualiza história por usuario_id                                                                                  |
| <div align="center">historiasClient.js   | <div align="center">DELETE | <div align="center">✔️checkAuthClient | <div align="center">`/deletarHistorias/:usuario_id`     | <div align="center">Deleta história por usuario_id                                                                                    |
| <div align="center">listrasClient.js     | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allListras/:usuario_id`           | <div align="center">Retorna as listras por usuario_id                                                                                 |
| <div align="center">listrasClient.js     | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarListras/:usuario_id`     | <div align="center">Atualiza as listras por usuario_id                                                                                |
| <div align="center">section1Client.js    | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allSection1/:usuario_id`          | <div align="center">Retorna a section1 por usuario_id                                                                                 |
| <div align="center">section1Client.js    | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarSection1/:usuario_id`    | <div align="center">Atualiza a section1 por usuario_id                                                                                |
| <div align="center">section2Client.js    | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allSection2/:usuario_id`          | <div align="center">Retorna a section2 por usuario_id                                                                                 |
| <div align="center">section2Client.js    | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarSection2/:usuario_id`    | <div align="center">Atualiza a section2 por usuario_id                                                                                |
| <div align="center">section3Client.js    | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allSection3/:usuario_id`          | <div align="center">Retorna a section3 por usuario_id                                                                                 |
| <div align="center">section3Client.js    | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarSection3/:usuario_id`    | <div align="center">Atualiza a section3 por usuario_id                                                                                |
| <div align="center">sobreClient.js       | <div align="center"> GET   | <div align="center">❌                | <div align="center">`/allSobre/:usuario_id`             | <div align="center">Retorna o sobre por usuario_id                                                                                    |
| <div align="center">sobreClient.js       | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarSobre/:usuario_id`       | <div align="center">Atualiza o sobre por usuario_id                                                                                   |
| <div align="center">usuariosClient.js    | <div align="center"> POST  | <div align="center">❌                | <div align="center">`/login`                            | <div align="center">Realiza o login usuários do blog                                                                                  |
| <div align="center">usuariosClient.js    | <div align="center"> POST  | <div align="center">✔️checkAuthClient | <div align="center">`/esqueceuSenha`                    | <div align="center">Recupera a senha do usuário do blog                                                                               |
| <div align="center">usuariosClient.js    | <div align="center"> PATCH | <div align="center">✔️checkAuthClient | <div align="center">`/atualizarUsuarios/:usuario_id`    | <div align="center">Atualiza informações de cadastro dos usuários do blog                                                             | -->
