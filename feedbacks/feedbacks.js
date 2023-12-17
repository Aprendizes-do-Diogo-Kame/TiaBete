
const consts = require('../consts/consts')

function getFeedbackMessage(jsonData) {

    let msg = ''
    

    switch(jsonData.category){
        case consts.categories.FOOD:  
            msg = `
Sua mensagem foi: '${jsonData.message}'. 

Registrei aqui:
Categoria: ${consts.categoriesPTBR.FOOD}
Horário: ${jsonData.date}
Itens: ${jsonData.items.join(", ")}
            `
            break;

        case consts.categories.MEDICINE:
            msg = `
Sua mensagem foi: '${jsonData.message}'. 

Registrei aqui:
Categoria: ${consts.categoriesPTBR.MEDICINE}
Horário: ${jsonData.date}
Nome: ${jsonData.name}
Quantidade: ${jsonData.quantity} unidades
            `
            break;

        case consts.categories.EXERCISE:
            msg = `
Sua mensagem foi: '${jsonData.message}'. 

Registrei aqui:
Categoria: ${consts.categoriesPTBR.EXERCISE}
Horário: ${jsonData.date}
Nome: ${jsonData.name}
Tempo: ${jsonData.time}
            `
            break;
            
        
        case consts.categories.GLUCOSE:
            msg = `
Sua mensagem foi: '${jsonData.message}'. 

Registrei aqui:
Categoria: ${consts.categoriesPTBR.GLUCOSE}
Horário: ${jsonData.date}
Índice glicêmico: ${jsonData.glucose}mg/dL
            `
            break;

        default:
            msg = `
Sua mensagem foi: '${jsonData.message}'. 

Parece que sua mensagem está fora do contexto de saúde e diabetes. Por favor, envie uma mensagem relacionada a este tema e ficarei feliz em ajudá-lo :)
`
            break;

    }

    console.log(msg)
    return msg
  
}

module.exports = {getFeedbackMessage};