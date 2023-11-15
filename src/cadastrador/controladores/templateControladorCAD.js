require("dotenv").config();
const knex = require("../../db/conexao");
const moment = require("moment");
const removeAccents = require("remove-accents");


const { transporter } = require("../../nodemailer/nodemailer");

const cadastrarTemplates = async (req, res) => {
  const { id_usuario } = req.params;

  const { nome_template, objetivo_template, extensao_template, motivo_invalidacao } = req.body;

  let tratar = nome_template.replace(/\s/g, '').toLowerCase();

  if (!nome_template || nome_template.length < 3) {
    return res.status(400).json({
      mensagem: "O nome do template é obrigatório", status: 400
    });
  }

  if (!objetivo_template || objetivo_template.length < 4) {
    return res.status(400).json({
      mensagem: "O objetivo do template é obrigatório", status: 400
    });
  }

  if (extensao_template === 'selecione') {
    return res.status(400).json({
      mensagem: "Selecione uma extensão válida", status: 400
    });
  }

  try {
    const usuario = await knex("BeaBa.usuarios").where({ id_usuario });

    let status_template;

    if (usuario[0].tipo_acesso === "Administrador") {
      status_template = "Ativo";

    } else if (usuario[0].tipo_acesso === "Cadastrador") {
      status_template = "Pendente";
    }

    const data_criacao_template = moment().format("YYYY-MM-DD HH:mm:ss");

    const template = await knex("BeaBa.templates")
      .insert({
        referencia_email: usuario[0].email,
        referencia_usuario: id_usuario,
        referencia_nome: usuario[0].nome_usuario,
        referencia_squad: usuario[0].squad,
        referencia_area: usuario[0].nome_area,
        data_criacao_template,
        nome_template: tratar,
        objetivo_template,
        extensao_template,
        status_template,
        motivo_invalidacao
      })
      .returning("*");

    res.status(201).json({
      mensagem: "Cadastro realizado com sucesso!",
      template,
      status: 201,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
    });
  }
};

const visualizarTemplates = async (req, res) => {
  const { id_template } = req.params;
  const referencia_template = id_template;

  try {
    const resultadoTemplates = await knex("BeaBa.templates").where({ id_template });

    if (resultadoTemplates.length === 0) {
      res.status(404).json({ mensagem: "Template não encontrado" });
      return;
    }

    const resultadoCampos = await knex("BeaBa.campos").where({ referencia_template });

    if (resultadoCampos.length === 0) {
      res.status(404).json({ mensagem: "Campos do template não encontrados" });
      return;
    }

    const camposEtipos = {};
    resultadoCampos.forEach((campo, index) => {
      camposEtipos[`${index + 1}`] = {
        id: campo.id_campo,
        nome: campo.nome_campo,
        tipo: campo.tipo_dado_campo,
      };
    });


    res.status(200).json({
      resultadoTemplates,
      camposEtipos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao buscar os templates.",
    });
  }
};

const verTabelaUploads = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const resultadoCampos = await knex("BeaBa.uploads")
      .where({ referencia_usuario: id_usuario })
      .select(
        'id_upload',
        'data_criacao_upload',
        'nome_upload',
        'caminho_upload',
        'referencia_template',
        'diretorio'
      );

    if (resultadoCampos.length === 0) {
      return res.status(404).json({ status: 404, mensagem: "Nenhum arquivo encontrado para o usuário." });
    }

    res.status(200).json({ uploads: resultadoCampos });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: "Erro ao buscar as informações do usuário e os uploads.",
    });
  }
}

const buscarTemplates = async (req, res) => {
  const { nome_area, squad, status_template } = req.params;
  const parametros = req.query;

  try {
    const templates = await knex('BeaBa.templates')
      .select('*')
      .where({ referencia_area: nome_area, referencia_squad: squad, status_template });

    const templatesFiltrados = templates.filter((template) => {
      const matches = Object.entries(parametros).every(([chave, valorParametro]) => {
        const valorTemplate = template[chave];

        if (chave === 'extensao_template') {
          return valorTemplate === valorParametro;
        } else {
          return (
            valorTemplate &&
            removeAccents(valorTemplate.toString().toLowerCase()).includes(
              removeAccents(valorParametro.toString().toLowerCase())
            )
          );
        }
      });

      return matches;
    });

    if (templatesFiltrados.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${templatesFiltrados.length} resultado${templatesFiltrados.length === 1 ? '' : 's'
          }.`,
        templatesFiltrados,
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Nenhum resultado foi encontrado para a sua busca.',
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const buscarTemplatesPendentes = async (req, res) => {
  const { id_usuario, status_template } = req.params;
  const parametros = req.query;

  try {
    const templates = await knex('BeaBa.templates')
      .select('*')
      .where({ referencia_usuario: id_usuario, status_template });

    const templatesFiltrados = templates.filter((template) => {
      const matches = Object.entries(parametros).every(([chave, valorParametro]) => {
        const valorTemplate = template[chave];

        if (chave === 'extensao_template') {
          return valorTemplate === valorParametro;
        } else {
          return (
            valorTemplate &&
            removeAccents(valorTemplate.toString().toLowerCase()).includes(
              removeAccents(valorParametro.toString().toLowerCase())
            )
          );
        }
      });

      return matches;
    });

    if (templatesFiltrados.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${templatesFiltrados.length} resultado${templatesFiltrados.length === 1 ? '' : 's'
          }.`,
        templatesFiltrados,
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Nenhum resultado foi encontrado para a sua busca.',
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const statusTemplates = async (req, res) => {
  const { status_template, nome_area, squad } = req.params;

  try {
    const resultado = await knex("BeaBa.templates").where({ status_template, referencia_area: nome_area, referencia_squad: squad });

    if (resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Nenhum template encontrado para o status e ID de usuário fornecidos.",
        status: 404,
        resultado: []
      });
    }

    return res.status(200).json({
      mensagem: "Templates encontrados com sucesso.",
      resultado: resultado,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensagem: "Erro ao buscar os templates.",
      status: 500,
    });
  }
};

const cadastrarCampos = async (req, res) => {
  const { id_template } = req.params;


  const { nome_campo, tipo_dado_campo } = req.body;

  if (!nome_campo || nome_campo.length < 3) {
    return res.status(400).json({
      mensagem: "O nome do campo é obrigatório",
      status: 400
    });
  }

  if (!tipo_dado_campo) {
    return res.status(400).json({
      mensagem: "O tipo de dado do campo é obrigatório",
      status: 400
    });
  }

  try {
    const campo = await knex("BeaBa.campos")
      .insert({
        referencia_template: id_template,
        nome_campo,
        tipo_dado_campo,
      })
      .returning("*");

    res.status(201).json({
      mensagem: "Cadastro realizado com sucesso!",
      status: 201,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
    });
  }
};

const atualizarTemplate = async (req, res) => {
  const { id_template } = req.params;
  const { nome_template, objetivo_template, extensao_template, motivo_invalidacao, campos } = req.body;

  if (!nome_template || nome_template.length < 3) {
    return res.status(400).json({
      mensagem: "O nome do template é obrigatório",
      status: 400
    });
  }

  if (!objetivo_template || objetivo_template.length < 4) {
    return res.status(400).json({
      mensagem: "O objetivo do template é obrigatório",
      status: 400
    });
  }

  try {
    const template = await knex("BeaBa.templates")
      .where({ id_template })
      .update({
        nome_template,
        objetivo_template,
        extensao_template,
        motivo_invalidacao
      })
      .returning("*");

    for (const campo of campos) {
      await knex("BeaBa.campos")
        .where({ referencia_template: id_template, id_campo: campo.id_campo })
        .update({
          nome_campo: campo.nome_campo,
          tipo_dado_campo: campo.tipo_dado_campo,
        });
    }

    res.status(200).json({
      mensagem: "Template e campos atualizados com sucesso!",
      template,
      status: 200,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: err.message,
    });
  }
};

const deletarTemplates = async (req, res) => {
  const { id_template } = req.params;

  try {
    const templates = await knex("BeaBa.templates").where({ id_template }).first();

    if (!templates) {
      return res.status(404).send({
        mensagem: "Template não encontrado",
        status: 404,
      });
    }

    await knex("BeaBa.templates").where({ id_template }).del();

    res.status(200).send({
      mensagem: "Template removido com sucesso!",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

const deletarCampos = async (req, res) => {
  const { id_template } = req.params;
  const referencia_template = id_template

  try {
    const campos = await knex("BeaBa.campos").where({ referencia_template }).first();

    if (!campos) {
      return res.status(404).send({
        mensagem: "Campos não encontrados",
        status: 404,
      });
    }

    await knex("BeaBa.campos").where({ referencia_template }).del();

    res.status(200).send({
      mensagem: "Campos removidos com sucesso!",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

module.exports = {
  cadastrarTemplates,
  statusTemplates,
  visualizarTemplates,
  buscarTemplatesPendentes,
  cadastrarCampos,
  deletarTemplates,
  buscarTemplates,
  atualizarTemplate,
  deletarCampos,
  verTabelaUploads
};
