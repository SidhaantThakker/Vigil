const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8082");

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
var stocks = {
    'REL': 0,
    'BIR': 20,
    'LAX': 0,
    ''
}
ws.addEventListener("open", () => {
    console.log("Connection Established!");

    while(true){
        sleep(500)
        ws.send(JSON.stringify(stocks))

        stocks.REL++;
        if(stocks.REL == 11)
            stocks.REL = 0;

        stocks.BIR-=2;
        if(stocks.BIR == 0)
            stocks.BIR = 20;

        stocks.LAX+=3;
        if(stocks.LAX == 21)
            stocks.LAX = 0;

    }

})