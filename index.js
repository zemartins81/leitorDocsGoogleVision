const express = require('express')
const multer = require('multer')
const ocr = require('./google-ocr')

const app = express()

const upload = multer({dest: './upload'})

app.set('view engine', 'ejs')

app.get('/ocr/demo', (req, res) => {
    res.render('index')
})

app.post('/ocr/demo', upload.single("file"), async (req, res) => {
    const response = await ocr.extract(req.file.path, req.file.mimetype)
    res.end(`Texto Extraído: ${response}`)

})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})