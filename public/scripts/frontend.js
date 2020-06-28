$(function() {
    "use strict";
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    var webSocketsServerIp = "localhost";
    var webSocketsServerPort = 1337;

    var myColor = false;
    var myName = false;
    // si el usuario entra desde mozilla, usar su propio web socket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // si no se da soporte a web socket
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Tu navegador no soporta Web Socket.' }));
        input.hide();
        $('span').hide();
        return;
    }

    // abrir la conexión
    var connection = new WebSocket(`ws://${webSocketsServerIp}:${webSocketsServerPort}`);
    connection.onopen = function() {
        // primero se solicita el nombre
        input.removeAttr('disabled');
        status.text('Elegir Nombre:');
    };
    connection.onerror = function(error) {
        // si hay problemas de conexión
        content.html($('<p>', {
            text: 'Problemas en la conexión con el servidor'
        }));
    };

    /**
     * Recepcion de mensajes
     */
    connection.onmessage = function(message) {
        try {
            //se intenta parsear el mensaje
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }

        if (json.type === 'color') {
            // primer respuesta es el color
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
        } else if (json.type === 'history') {
            // ingresar todos los mensajes del historial en la ventana
            for (var i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                    json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') {
            // recibir mensaje y permitir escribir otro
            input.removeAttr('disabled');
            addMessage(json.data.author, json.data.text,
                json.data.color, new Date(json.data.time));
        } else {
            console.log('Formato de JSON no reconocido:', json);
        }
    };

    /**
     * Enviar un mensaje cuando se presiona la tecla Enter
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            connection.send(msg);
            $(this).val('');

            // espero hasta que el servidor responde
            input.attr('disabled', 'disabled');

            // como el nombre es el primer mensaje, lo guardo
            if (myName === false) {
                myName = msg;
            }
        }
    });

    /**
     * Agregar un mensaje a la ventana de chat
     */
    function addMessage(author, message, color, dt) {
        if (author === 'SERVER') {
            content.append('<p style="text-align:center"></span style="color:' + color + '">' +
                (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':' +
                (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) +
                ': ' + message + '</p>');
        } else {
            content.append('<p><span style="color:' + color + '">' +
                author + '</span> @ ' + (dt.getHours() < 10 ? '0' +
                    dt.getHours() : dt.getHours()) + ':' +
                (dt.getMinutes() < 10 ?
                    '0' + dt.getMinutes() : dt.getMinutes()) +
                ': ' + message + '</p>');
        }

        // scrollear el chat
        var element = document.getElementById("content");
        element.scrollTop = element.scrollHeight;
    }
});