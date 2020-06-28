const expressClientPort = 8000;
const express = require('express');
const app = express();

app.use(express.static(__dirname + "/public"));

app.listen(expressClientPort, console.log(`Cliente conectado en localhost:${expressClientPort}`))