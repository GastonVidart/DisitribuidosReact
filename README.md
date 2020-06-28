# Disitribuidos React

El presente repositorio, pertenece al trabajo realizado por alumnos de la Factultad de Informática, para la materia Labortorio de Programación Distribuida. En el mismo se realiza la implementación de una aplicación distribuida que utiliza el paradigma de programación reactiva.

## Requisitos
* Instalar Node

*Se utilizó Express y WebSocket en la implementación, pero sus dependencias se encuentran la configuración. Por lo tanto se instalan automáticamente*

## Ejecución
1. Abrir la terminal

2. Ir a la carpeta a donde se haya clonado el repositorio o descargado el contenido del mismo

3. Ejecutar al script client.js con el siguiente comando
```
node client
```
>Por defecto se publica en localhost:8000

4. Ejecutar al script client.js con el siguiente comando
```
node server
```
>Por defecto se publica en localhost:1337

## Funcionalidades
* Chat entre diferentes usuarios.
* Definir nombre de usuario
* Establecer color para el nombre de usuario
* Visualizar los últimos 100 mensajes enviados
* Los nuevos clientes reciben los ultimos 100 mensajes que haya en el servidor

*Se puede probar con varias ventanas del navegador, sino que otra pc se conecta a la ip y puerto en el que se publicó*

## Material
* Código de Referencia https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
* Diapositivas de la materia