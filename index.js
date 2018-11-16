const express = require('express')
const http = require('http');
const WebSocket = require('ws')
const path = require('path')

var app = express()

var PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var connections = [];

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.on('connection', function connection(ws) {

    ws.id = wss.getUniqueID();

    ws.on('message', function incoming(data) {
        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
            console.log(client.id);
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', function (connection) {
        console.log('conexao fechada ' + ws.id);
        delete connections[ws.id];
    });

    connections[ws.id] = ws;
});

//conf das paginas webZera
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(__dirname + '/public'));

server.listen(PORT, function () {
    console.log('Server is UP... of the caspa !!!');
});