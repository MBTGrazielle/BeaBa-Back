require("dotenv").config();
const knex = require("../../db/conexao");
const multer = require('multer');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');

// Configurar o armazenamento dos arquivos com multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../', 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

async function uploadFile(req, res) {
    try {
        // Verificar se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }

        res.status(200).send('Arquivo enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar o arquivo localmente:', error);
        res.status(500).send('Erro ao enviar o arquivo.');
    }
}

// const verificarArquivo = (req, res) => {
//     try {
//         const filePath = 'C:\\Users\\980184\\Desktop\\QQtech\\BeaBa-Back\\src\\administrador\\uploads\\notasfiscais.CSV';
//         const columnInfo = [];

//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('headers', (headers) => {
//                 columnInfo.push(...headers.map((header) => ({ name: header, type: 'string' })));
//             })
//             .on('end', () => {
//                 res.status(200).send({ message: 'Informações do arquivo verificadas com sucesso', columnInfo });
//             });

//         console.log(columnInfo)
//     } catch (error) {
//         console.error('Erro ao verificar informações do arquivo:', error);
//         res.status(500).send('Erro ao verificar as informações do arquivo.');
//     }
// };

const verificarArquivo = (req, res) => {
    try {
        const filePath = 'C:\\Users\\980184\\Desktop\\QQtech\\BeaBa-Back\\src\\administrador\\uploads\\novo.XLSX';

        const XLSX = require('xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Array para armazenar as informações das colunas
        const columnInfo = [];

        // Iterar sobre as células a partir da A2 para obter nomes das colunas e valores das linhas
        for (const key in worksheet) {
            if (!worksheet.hasOwnProperty(key)) {
                continue;
            }

            // Ignorar letras da linha 1 (A1, B1, etc.)
            if (key.match(/^[A-Z]+1$/)) {
                continue;
            }

            const header = key.replace(/[0-9]/g, ''); // Remove números dos cabeçalhos
            const cell = worksheet[key];

            // Verificar se o nome da coluna contém apenas letras de A a Z
            if (!/^[A-Za-z]+$/.test(header)) {
                continue;
            }

            // Determine o tipo de dado do valor da célula usando typeof
            const tipo_coluna = typeof cell.v;

            // Adicione informações da coluna para cada célula
            columnInfo.push({
                nome_coluna: header,
                valor_coluna: cell.v,
                tipo_coluna: tipo_coluna,
            });
        }

        console.log('Informações das colunas:', columnInfo);

        res.status(200).send({ message: 'Informações do arquivo verificadas com sucesso', columnInfo });
    } catch (error) {
        console.error('Erro ao verificar informações do arquivo:', error);
        res.status(500).send('Erro ao verificar as informações do arquivo.');
    }
};


module.exports = { uploadFile, verificarArquivo };
