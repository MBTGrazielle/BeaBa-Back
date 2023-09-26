const { exec } = require('child_process');

// Caminho para o arquivo Python
const pythonScriptPath = 'caminho_para_seu_arquivo_python.py';

// Comando para executar o script Python
const command = `python ${pythonScriptPath}`;

// Executa o script Python
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o script Python: ${error}`);
    return;
  }
  console.log(`Saída do script Python: ${stdout}`);
});
