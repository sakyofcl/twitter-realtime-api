const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const path = require('path');
const currencyStream = new WebSocket('wss://ws.eodhistoricaldata.com/ws/crypto?api_token=demo');
let isCurrencyConnected = false;
let termKeys = ['ETH-USD'];
let alreadyInitiate = false;

// Serve client-side files
app.use('/client', express.static(path.join(__dirname, 'public')));

currencyStream.on('open',()=>{
    console.log("connected.");
});

wss.on('connection', (ws) => {
    
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString('ascii'));

        switch (data.action) {
            case 'toggleConnection':
                toggleCurrencyConnection(ws);
                break;
            case 'terms':
                setTerms(data.payload);
                break;

        }
    });
});

function toggleCurrencyConnection(ws) {
    listenStream(ws);
    if (isCurrencyConnected) {
        stopStream();
        isCurrencyConnected = false;
        sendToClient(ws, {message: 'off'});
    } else {
        startStream();
        isCurrencyConnected = true;
        sendToClient(ws, {message: 'on'});
    }
}

function sendToClient(ws,data){
    ws.send(JSON.stringify(data));
}

function startStream(){
    currencyStream.send(`{"action":"subscribe", "symbols":"${termKeys.join(',')}" }`);
}

function stopStream(){
    currencyStream.send(`{"action":"unsubscribe", "symbols":"${termKeys.join(',')}" }`);
}

function listenStream(out){
    if(!alreadyInitiate){
        alreadyInitiate = true;
        currencyStream.on('message', (message) => {
            const data = JSON.parse(message.toString('ascii'));
            sendToClient(out,{streamData: data});
        });
    }
}

function setTerms(newTerm){
    currencyStream.send(`{"action":"unsubscribe", "symbols":"${termKeys.join(',')}" }`);
    currencyStream.send(`{"action":"subscribe", "symbols":"${newTerm.join(',')}" }`);
    termKeys=newTerm;
}


server.listen(3000,'localhost', () => {
    console.log('Server is running on http://localhost:3000');
});

