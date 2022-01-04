const express = require("express")
const ws = require("ws");
const app = express()


const wsServer =  new ws.Server({ noServer: true})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var stocks = []
var triggers = [
    {
        name: 'REL', 
        option:'>', 
        value:'5'
    }
]

wsServer.on("connection", socket => {
    console.log("Client has connected!");
    socket.on("message", data => {
        //console.log(data.toString());
        stocks = JSON.parse(data);
        checkTriggers()
    });
});

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('pages/index', {
        stocks: stocks,
        triggers: triggers
    });
});

app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.post('/triggers', (req, res) => {
    console.log("Adding new trigger - " + req.body)
    triggers.push(req.body)
    console.log(triggers)
    res.redirect('/')
});

const server = app.listen(8082);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});

function checkTriggers(){
    //console.log("Checking Triggers!")
    //console.log(triggers)
    console.log(stocks)
    for(trigger of triggers){
        //console.log(trigger)
        var name = trigger.name
        var option = trigger.option
        var value = trigger.value
        //console.log("Checking ", name, "Value", stocks[name])
        if(option == '>'){
            if(stocks[name] > value){
                console.log(name + " has gone above set value " + value)
            }
        } else if (option == '=') {
            if(stocks[name] == value){
                console.log(name + " has matched set value " + value)
            }
        } else if (option == '<') {
            if(stocks[name] < value){
                console.log(name + " has gone below set value " + value)
            }
        } else {
            console.log("ERROR - INVALID OPTION")
        }
    }
}