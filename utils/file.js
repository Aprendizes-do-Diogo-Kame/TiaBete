const axios = require('axios')
const fs = require('fs')
require('dotenv').config();

async function saveMedia(name, data){
    fs.writeFile("./files/"+name, data, (error) => {
        if(error){
            throw new Error("Erro ao salvar arquivo: ", error)
        }
    })
}

module.exports ={saveMedia}