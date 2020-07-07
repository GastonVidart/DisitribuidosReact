"use strict";
process.title = 'node-chat';

const webSocketsServerPort = 1337;
const webSocketServer = require('websocket').server;
const http = require('http');
const cron = require("node-cron");

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

    new cron.schedule('* * * * * *', () => {
        connection.sendUTF(JSON.stringify(actualizarHora()));
    });

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

                broadcastMessage('SERVER', 'black', 'Bienvenido: ' + userName);
            } else {
                console.log((new Date()) + ' Nuevo mensaje -> ' +
                    userName + ': ' + message.utf8Data);

                broadcastMessage(userName, userColor, message.utf8Data);
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

function broadcastMessage(userName, userColor, message) {
    // guardo el mensaje en el historial
    var obj = {
        time: (new Date()).getTime(),
        text: htmlEntities(message),
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


/**
 * Función para evitar input strings
 */
function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Obtiene la fecha y hora y las devuleve en un JSON
 */
function actualizarHora() {
    var fecha = new Date(),
        horaAux = fecha.getHours(),
        minutosAux = fecha.getMinutes(),
        segundosAux = fecha.getSeconds(),
        diaSemana = fecha.getDay(),
        dia = fecha.getDate(),
        mes = fecha.getMonth(),
        anio = fecha.getFullYear(),
        ampm;

    if (horaAux >= 12) {
        horaAux = horaAux - 12;
        ampm = "PM";
    } else {
        ampm = "AM";
    }
    if (horaAux == 0) {
        horaAux = 12;
    }

    var hora, minutos, segundos;

    if (horaAux < 10) { hora = "0" + horaAux } else { hora = "" + horaAux };
    if (minutosAux < 10) { minutos = "0" + minutosAux } else { minutos = "" + minutosAux };
    if (segundosAux < 10) { segundos = "0" + segundosAux } else { segundos = "" + segundosAux };

    return {
        type: "fecha",
        data: {
            hora,
            minutos,
            segundos,
            diaSemana,
            dia,
            mes,
            anio,
            ampm
        }
    }
}