# Disitribuidos React

El presente repositorio, pertenece al trabajo realizado por alumnos de la Factultad de Informática, para la materia Labortorio de Programación Distribuida. En el mismo se realiza la implementación de una aplicación distribuida que utiliza el paradigma de programación reactiva. Se desarrollo siguiendo el tutorial del [siguiente sitio](https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61).

## Requisitos
* Instalar Node

Como se utilizó Express, WebSocket y Yargs en la implementación y sus dependencias se encuentran la configuración, estos deben estar instalados. Para poder instalarlos se deben ejecutar los siguientes comandos:

>npm i express

>npm i websocket

>npm i yargs

## Ejecución
1. Abrir la terminal.

2. Ir a la carpeta a donde se haya clonado el repositorio o descargado el contenido del mismo.

3. Ejecutar al script server.js con el siguiente comando.
```
node server
```
>Por defecto se publica en localhost:1337

4. Ejecutar al script client.js con el siguiente comando, se permite utilizar un puerto personalizado.

```
node client [--port="numPort"]
```
>Por defecto se publica en localhost:8000

## Funcionalidades
* Chat entre diferentes usuarios.
* Definir nombre de usuario
* Visualizar los últimos 100 mensajes enviados
* Los nuevos clientes reciben los ultimos 100 mensajes que haya en el servidor
* Se reciben notificaciones por parte del servidor
* Fecha y hora incorporados

*Se puede probar con varias ventanas del navegador, sino que otra pc se conecte a la ip y puerto en el que se publicó la aplicación.*

## JQuery

Para que el chat pueda mostrar mensajes dinámicamente, es decir, de forma reactiva, se utilizo JQuery. Esta es una libreria de Javascript de codigo abierto, que permite la interactividad y la manipulación de elementos como botones, imagenes, textos, cambiar el diseño de CSS y realizar peticiones Ajax de manera sencilla. La interactividad se logra mediante la utilización de metodos Ajax que permite intercambiar información con un servidor y actualizan parte de la pagina sin tener que recargar la misma.

Para utilizar la misma sin tener que descargarla se vinculo la libreria utilizando el servidor de Google dentro del body y al final del frontend con la siguiente linea:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
```
