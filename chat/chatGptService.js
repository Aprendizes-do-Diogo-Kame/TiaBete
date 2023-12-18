var oai = require("openai")

const openai = new oai({ apiKey: process.env.OPENAI_API_KEY});


async function categorize(messageDate, userInput) {
  
  const finalMessage = `dada uma frase, quero que você categorize ela em FOOD, MEDICINE, EXERCISE, GLUCOSE, OTHER. Quero que a sua resposta seja apenas um json e nada mais, respeitando os seguintes formatos:
    
  frase: "1702754968" "tomei café, comi pão de queijo, macarronada, pao com ovo"
  resposta: 
  {
      category: "FOOD",
      message: "tomei café, comi pão de queijo, macarronada, pao com ovo",
      date: "1702754968",
      items: [
              "café",
              "pão de queijo",
              "macarronada",
              "pao com ovo"
            ]
  }

  frase: "1702754968" "tomei agua"
  resposta: 
  {
      category: "FOOD",
      message: "tomei agua",
      date: "1702754968",
      items: [
              "agua"
            ]
  }

  frase: "1702754968" "bebi vodka"
  resposta: 
  {
      category: "FOOD",
      message: "bebi vodka",
      date: "1702754968",
      items: [
              "vodka"
            ]
  }
  
  frase: 1702834921 "tomei 30 de insulina"
  resposta: 
  {
      category: "MEDICINE",
      message: "tomei 30 de insulina",
      date: "1702834921",
      name: "insulina",
      quantity: 30
  }
  
  frase: 1702834929 "fiz 30min de caminhada"
  resposta:
  {
      category: "EXERCISE",
      message: "fiz 30min de caminhada",
      date: "1702834929",
      name: "caminhada",
      time: 0:30:0
  }

  frase: 1702834929 "fiz luta hoje"
  resposta:
  {
      category: "EXERCISE",
      message: "fiz luta hoje",
      date: "1702834929",
      name: "luta",
      time: 0:0:0
  }
  
  frase: 1702754968 "minha glicose ta 103"
  resposta:
  {
      category: "GLUCOSE",
      message: "minha glicose ta 103",
      date: "1702754968",
      glucose: 103
  }

  frase: 1702754968 "hoje tive hipoglicemia"
  resposta:
  {
      category: "GLUCOSE",
      message: "hoje tive hipoglicemia",
      date: "1702754968",
      glucose: 60
  }

  frase: 1702754968 "hoje tive hiperglicemia"
  resposta:
  {
      category: "GLUCOSE",
      message: "hoje tive hiperglicemia",
      date: "1702754968",
      glucose:200
  }
  
  frase: 1702834929 "bla bla bla"
  resposta:
  {
      category: "OTHER",
      message: "bla bla bla",
      date: "1702834929",
  }
  
  Coisas relacionadas a glicose, como alto indice glicemico ou baixo indice glicemico, hipoglicemia ou hiperglicemia, entre outros relacionados a glicose devem tudo entrar na categoria GLUCOSE e campo glucose deve sempre receber 60 em caso de hipoglicemia, e 200 em caso de hiperglicemia.
  Caso a frase dê a entender a ingestão de bebida  ou comida, deve entrar na categoria FOOD.
  Agora faça com este exemplo, Frase: "${messageDate}" "${userInput}"`
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: finalMessage }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion)
  console.log("Mensagem:", completion.choices[0].message)
  const chatGptJson = completion.choices[0].message.content
  const cleanedJsonString = chatGptJson.replace(/\\n/g, '').replace(/' \+/g, '').replace(/' /g, '');
  const jsonObject = JSON.parse(cleanedJsonString);
  return jsonObject
  
}

async function getFeedbackMessage(message) {

  console.log("Mensagem enviada para o chat: ", message)
  
  const finalMessage = `
  Estou criando um bot, chamado TiaBete, que foi projetado para ser um assistente fácil de usar para o controle do diabetes, com foco no monitoramento de nutrição, medicamentos, exercícios e níveis de glicose no sangue. Ao encontrar informações pouco claras ou incompletas, ela fará perguntas específicas educadamente para esclarecer. Por exemplo, se um usuário menciona uma refeição, mas não especifica o que comeu, TiaBete pode perguntar: 'Você poderia me dizer quais alimentos estavam em sua refeição?' Isso garante uma gravação precisa. Ela manterá seu comportamento casual e amigável, garantindo que os usuários se sintam confortáveis e, ao mesmo tempo, fornecendo os detalhes necessários para seus registros de controle do diabetes.

  Quero que, dada uma mensagem, você me forneça uma resposta como se fosse este bot que criei. A resposta deve ser objetiva e curta e se restringir a no máximo 500 caracteres e não perguntar nem pedir informações adicionais, apenas registrar dentro do possível com o que foi informado e inferir o que for possível. 
  
  Mensagem: ${message}
  
  `

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: finalMessage }],
    model: "gpt-4-1106-preview",
  });

  console.log(completion)
  const chatGptResp = completion.choices[0].message.content
  console.log(chatGptResp)
  return chatGptResp
}



module.exports = {categorize, getFeedbackMessage};