let expressClientPort = 8000;

const express = require('express');
const app = express();
const argv = require('yargs').argv;

// verificar si se recibio port por parametro
if (argv.port != undefined && Number.isInteger(argv.port)) {
    expressClientPort = argv.port;
}

app.use(express.static(__dirname + "/public"));

app.listen(expressClientPort, console.log(`Cliente conectado en localhost:${expressClientPort}`));