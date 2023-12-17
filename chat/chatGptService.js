var oai = require("openai")

const openai = new oai({ apiKey: process.env.OPENAI_API_KEY});


async function categorize(messageDate, userInput) {
  
  const finalMessage = `dada uma frase, quero que você categorize ela em FOOD, MEDICINE, EXERCISE, GLUCOSE, OTHER. Quero que a sua resposta seja apenas um json e nada mais, respeitando os seguintes formatos:
    
  frase: "23-10-10 8:41" "tomei café, comi pão de queijo"
  resposta: 
  {
      category: "FOOD",
      message: "tomei café, comi pão de queijo",
      date: "23-10-10 8:41",
      items: [
              "café",
              "pão de queijo"
            ]
  }
  
  frase: 23-10-10 10:10 "tomei 30 de insulina"
  resposta: 
  {
      category: "MEDICINE",
      message: "tomei 30 de insulina",
      date: "23-10-10 10:10",
      name: "insulina",
      quantity: 30
  }
  
  frase: 23-10-10 11:00 "fiz 30min de caminhada"
  resposta:
  {
      category: "EXERCISE",
      message: "fiz 30min de caminhada",
      date: "23-10-10 11:00",
      name: "caminhada",
      time: 0:30:0
  }
  
  frase: 23-10-10 12:10 "minha glicose ta 103"
  resposta:
  {
      category: "GLUCOSE",
      message: "minha glicose ta 103",
      date: "23-10-10 12:10",
      glucose: 103
  }
  
  frase: 23-10-10 13:09 "bla bla bla"
  resposta:
  {
      category: "OTHER",
      message: "bla bla bla",
      date: "23-10-10 13:09",
  }
  
  
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

module.exports = {categorize};