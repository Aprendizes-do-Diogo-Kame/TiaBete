require('dotenv').config()
const providers = require('./providers')
const chat = require('./chat')

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

app.post("/webhook", function (request, response) {
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
    let msgText;
    if(!status){
      if(messageType == "text"){
        let messageContent = request.body.entry[0].changes[0].value.messages[0].text.body;
        console.log(messageContent);
        msgText = chat.chatGptService.categorize(messageTimeStamp, messageContent)
        console.log(msgText);
        chat.text.send(ourNumberId, messageFrom, msgText);
      } else if(messageType == "audio"){
        msgText = chat.chatGptService.categorize(messageTimeStamp, messageContent);
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

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});