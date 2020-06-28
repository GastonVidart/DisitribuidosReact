"use strict";
process.title = 'node-chat';

const webSocketsServerPort = 1337;
const webSocketServer = require('websocket').server;
const http = require('http');

/**
 * Variables Globales
 */
// historial de últimos 100 mensajes
var history = [];
// usuarios conectados al chat
var clients = [];
// colores de usuarios posibles ordenados aleatoriamente
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
colors.sort(function(a, b) { return Math.random() > 0.5; });

/**
 * Servidor HTTP utilizado por el WebSocket
 */
var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + "Server escuchando en el puerto: " +
        webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer: server
});

/**
 * Esta función es ejecutada en cada intento de 
 * conexión por parte de un Cliente 
 */
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Conexión desde: ' +
        request.origin + '.');

    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    var userName = false;
    var userColor = false;
    console.log((new Date()) + ' Conexión aceptada.');
    if (history.length > 0) {
        connection.sendUTF(
            JSON.stringify({ type: 'history', data: history }));
    }

    // se recibe un mensaje del usuario
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // el primer mensaje recibido debe ser el nombre del usuario
            if (userName === false) {
                userName = htmlEntities(message.utf8Data);
                // obtener color aleatorio y enviarlo al usuario
                userColor = colors.shift();
                connection.sendUTF(
                    JSON.stringify({ type: 'color', data: userColor }));
                console.log((new Date()) + ' El usuario: ' + userName +
                    ' tiene color ' + userColor + '.');

            } else {
                console.log((new Date()) + ' Nuevo mensaje -> ' +
                    userName + ': ' + message.utf8Data);

                // guardo lel mensaje en el historial
                var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message.utf8Data),
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);
                // hago broadcast del mensaje recibido a los clientes
                var json = JSON.stringify({ type: 'message', data: obj });
                for (var i = 0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    // se desconecta el usuario
    connection.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer " +
                connection.remoteAddress + " disconnected.");
            // quitar al cliente de la lista de usuarios conectados
            clients.splice(index, 1);
            // devolver el color para que pueda ser usado por otro
            colors.push(userColor);
        }
    });
});

/**
 * Función para evitar input strings
 */
function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}