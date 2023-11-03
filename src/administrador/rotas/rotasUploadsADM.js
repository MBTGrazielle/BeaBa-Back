const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile, verificarArquivo } = require('../controladores/uploadsControladorADM')

const router = express.Router();


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

router.post('/adm/salvarUpload', upload.single('fileInput'), uploadFile);
router.post('/adm/verificarArquivo', verificarArquivo);

module.exports = router;