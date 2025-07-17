const WebSocket = require('ws');

//need to make a websocket server that listens on port 8080 (standard)

const wss = new WebSocket.Server({port:8080});

//this map is going allow us to store each user when they come online along with their ws object (connection)
// clients = userId: WebSocket connection
const clients = new Map();

//everything for websockets is event driven...

//on a client connection to the server we want to get their ws object 
wss.on('connection', (ws) => {
  console.log('New WebSocket connection has been established')

  






})