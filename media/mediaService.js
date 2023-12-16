const axios = require('axios')
require('dotenv').config();

async function getMediaUrl(idMedia){
    try{
        let response = await axios({
            method: "GET",
            url:
            "https://graph.facebook.com/v18.0/" + idMedia,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.FB_API_TOKEN}`
            },
        });
        console.log("Informações de mídia recebidas: ", response);
        return response.data;
    } catch (error) {
        throw new Error("Erro ao receber informações da mídia: ", error);
    }
}

// async function downloadMedia(url){
//     try{
//         let response = await axios({
//             method: "GET",
//             url,
//             headers: {
//                 //"Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.FB_API_TOKEN}`
//             },
//         });
//         console.log("Informações de mídia recebidas: ", response);
//         return response.data;
//     } catch (error) {
//         throw new Error("Erro ao receber informações da mídia: ", error);
//     }
// }

module.exports = {getMediaUrl};