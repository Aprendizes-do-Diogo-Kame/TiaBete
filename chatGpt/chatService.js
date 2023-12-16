
var oai = require("openai")

const openai = new oai({ apiKey: process.env.OPENAI_API_KEY});

exports.testando = async (message) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion)

  console.log(completion.choices[0]);


}

