require('dotenv').config();
const { createClient } = require("@deepgram/sdk");

const fs = require('fs')

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

async function transcription(filePath){

    console.log("Transcrevendo arquivo : ", filePath)

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fs.createReadStream(filePath),
        {
            model: "nova-2",
            language: "pt-BR"
        }
    );

    if(error){
        throw new Error("Erro ao transcrever arquivo: ", error)
    }

    return result.results.channels[0].alternatives[0].transcript
}

module.exports = {transcription};
