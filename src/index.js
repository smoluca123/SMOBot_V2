require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');

const client = new ExtendedClient();

client.start();

// Handles errors and avoids crashes, better to not remove them.
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

var http = require('http');
http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);
