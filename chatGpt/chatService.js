
var oai = require("openai")

const openai = new oai({ apiKey: process.env.OPENAI_API_KEY});

exports.testando = async () => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

