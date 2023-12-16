require('dotenv').config()

var express = require('express')
  , bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

var chatService = require('../TiaBete/chatGpt/chatService');

app.get('/', function(req, res){
    res.send('Deu bom')
})

app.get('/webhook', function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == process.env.FB_VERIFICATION_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
    console.log("Facebook verificou a URL")
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhook", function (request, response) {
  console.log('Incoming webhook: ' + JSON.stringify(request.body));
  response.sendStatus(200);
});

/* pra testar
curl --location 'localhost:45035/chatgpt' \
--header 'Content-Type: application/json' \
--data '{
    "message": "comi banana"
}'
*/
app.post('/chatgpt', function(req, res){
  let message = req.body.message
  chatService.categorize(message)
  res.send(200)
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});