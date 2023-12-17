require('dotenv').config()
const providers = require('./providers')
const chat = require('./chat')
const media = require('./media')
const file = require('./utils/file')
const time = require('./utils/converTime')
const feedbacks = require('./feedbacks/feedbacks')
const mongodb = require('./mongoDB')

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.sendStatus(200)
})

app.get('/webhook', function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == process.env.FB_VERIFICATION_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
    console.log("Facebook verificou a URL");
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhook", async function (request, response) {
  console.log('Incoming webhook: ' + JSON.stringify(request.body));
  if (
	request.body.entry &&
	request.body.entry[0].changes &&
	request.body.entry[0].changes[0] &&
	request.body.entry[0].changes[0].value.messages &&
	request.body.entry[0].changes[0].value.messages[0]
) {
    let messageType = request.body.entry[0].changes[0].value.messages[0].type;
    let messageFrom = request.body.entry[0].changes[0].value.messages[0].from;
    let messageTimeStamp = request.body.entry[0].changes[0].value.messages[0].timestamp;
    let ourNumberId = request.body.entry[0].changes[0].value.metadata.phone_number_id;
    let status = request.body.entry[0].changes[0].statuses;
    let contactName = request.body.entry[0].changes[0].value.contacts[0].profile.name;
    let msgText;
    if(!status){
      if(messageType == "text"){
        let messageContent = request.body.entry[0].changes[0].value.messages[0].text.body;
        if(messageContent.includes("Oi, TiaBete. É a minha primeira vez aqui!")){
          const user = await mongodb.getUser(messageFrom)
          //if verifyUser send oi, usuário
          if(user) {
            msgText = `Bem-vindo de volta, ${user.name}!`;
            chat.text.send(ourNumberId, messageFrom, msgText);
          } else {
            const userJson = {
              name: contactName,
              phone: messageFrom
            }
            await mongodb.createUser(userJson);
            msgText = `Olá, ${userJson.name}! 
            Sou a TiaBete, sua parceira para o controle do diabetes! Estou aqui para te ajudar a acompanhar sua alimentação, medicamentos, exercícios e glicose no sangue. 

            Vamos juntos tornar o gerenciamento do diabetes mais fácil, barato e tranquilo. 

            Você pode me dizer tudo o que pode impactar em seu índice glicêmico, como por exemplo:

            . Alimentação ("Comi macarronada agora");
            . Exercícios físicos ("Fiz 30 minutos de natação");
            . Glicemia ("Minha glicose está em 100mg/dL);
            . Medicamentos ("Tomei uma dose de insulina");

            Você pode me mandar em *áudio* se preferir.`

            chat.text.send(ourNumberId, messageFrom, msgText);
          }
          //else criar usuário e send onboarding
          
        } else {
          console.log(messageContent);
          let jsonResult = await chat.chatGptService.categorize(messageTimeStamp, messageContent)
          msgText = await feedbacks.getFeedbackMessage(jsonResult)
          chat.text.send(ourNumberId, messageFrom, msgText);
        }
      } else if(messageType == "audio"){
        let mediaId = request.body.entry[0].changes[0].value.messages[0].audio.id;
        let messageContent = await media.mediaService.getFileAndTranscribe(mediaId)
        let jsonResult = await chat.chatGptService.categorize(messageTimeStamp, messageContent);
        msgText = await feedbacks.getFeedbackMessage(jsonResult)
        chat.text.send(ourNumberId, messageFrom, msgText);
      } else {
        console.log("API inconsistente")
        msgText = "Ainda estou aprendendo a responder esse tipo de mensagem."
        chat.text.send(ourNumberId, messageFrom, msgText);
      }
    }
    response.sendStatus(200);
} else {
	response.sendStatus(400);
}
});

/**
 * Endpoints de teste
 */
app.get('/transcreva/:id', async function(req, res) {
  try{
    let mediaId = req.params.id 
    result = await media.mediaService.getFileAndTranscribe(mediaId)
    res.send(result)
  } catch (e){
    res.sendStatus(500)
  }
});

app.get('/chatgpt', async function(req, res) {
  try{
    let message = req.body.message 
    let messageTimestamp = req.body.messageTimestamp 
    let jsonResult = await chat.chatGptService.categorize(messageTimestamp,message)
    let formattedMessage = await feedbacks.getFeedbackMessage(jsonResult)
    res.send(formattedMessage)
  } catch (e){
    res.sendStatus(500)
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});