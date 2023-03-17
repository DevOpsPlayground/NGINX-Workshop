const express = require('express');
const cors = require('cors')
const server = express();
const serverNum = process.env.serverNum;

server.use(cors({
    origin: '*'
}));

server.get('/*', (req, res) => {
	res.send(`This text is served by express.js worker ${serverNum}`)
});

server.listen(80);
