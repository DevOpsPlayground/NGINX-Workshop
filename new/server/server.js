const express = require('express');
const server = express();
const serverNum = process.env.serverNum;

server.get('/', (req, res) => {
	res.send(`This page is served by server ${serverNum}`)
});

server.listen(80);
