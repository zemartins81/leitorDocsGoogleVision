const vision = require('@google-cloud/vision')
const {client_email, private_key, project_id} = require('./google-ocr-credentials.json')
const fs = require('fs')

const client = new vision.ImageAnnotatorClient({
    credentials: {
        client_email,
        private_key,
        project_id
    }
})

module.exports.extract = async (filepath = '', mimeType = '') => {
    const fileBuffer = await fs.readFileSync(filepath)
    const requestNeeded = ['application/pdf', 'image/gif', 'image/tiff'].some(e => e === mimeType)

    const inputConfig = {
        mimeType,
        content: fileBuffer
    }


    const features = [{
        type: 'DOCUMENT_TEXT_DETECTION'
    }]

    const request = {
        requests: [
            {
                inputConfig,
                features,
                pages: [1]
            }
        ]
    }


    const [result] =
        requestNeeded
            ? await client.batchAnnotateFiles(request)
            : await client.documentTextDetection(fileBuffer)


    const fullTextAnnotation = await result.fullTextAnnotation || await result.responses[0].responses[0].fullTextAnnotation

    console.log(fullTextAnnotation.text)

    return fullTextAnnotation.text
}