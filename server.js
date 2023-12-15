require('dotenv').config()
const providers = require('./providers')
const chat = require('./chat')

var express = require('express')
  , bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.send('Deu bom')
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
  response.sendStatus(200);
  if (
	request.body.entry &&
	request.body.entry[0].changes &&
	request.body.entry[0].changes[0] &&
	request.body.entry[0].changes[0].value.messages &&
	request.body.entry[0].changes[0].value.messages[0]
) {
    let messageType = request.body.entry[0].changes[0].value.messages[0].type;
    let messageContent = request.body.entry[0].changes[0].value.messages[0].text.body;
    let messageFrom = request.body.entry[0].changes[0].value.messages[0].from;
    let msgText;
    if(messageType == "text"){
        console.log(messageContent);
        console.log(messageFrom);
        let ourNumberId = request.body.entry[0].changes[0].value.metadata.phone_number_id;
        msgText = "Mensagem recebida."
        chat.text.send(ourNumberId, messageFrom, msgText);
    } else {
      msgText = "Ainda estou aprendendo a responder esse tipo de mensagem."
      chat.text.send(ourNumberId, messageFrom, msgText);
    }
    response.sendStatus(200);
} else {
	response.sendStatus(400);
}
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});