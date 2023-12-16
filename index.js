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
  let message= req.body.message
  chatService.testando(
    `dada uma frase, quero que você categorize ela em FOOD, MEDICINE, EXERCISE, GLUCOSE, OTHER. quero que a sua resposta seja um json respeitando os seguintes formatos:
    
    frase: 23-10-10 8:41 "tomei café, comi pão de queijo"
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
    
    
    Agora faça com este exemplo: Frase: 24-05-11 13:09 "${message}"`
  )
  res.send(200)
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});