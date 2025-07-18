const WebSocket = require("ws");

//need to make a websocket server that listens on port 8080 (standard)

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server running on port 8080');
//this map is going allow us to store each user when they come online along with their ws object (connection)
// clients = userId: WebSocket connection
const clients = new Map();

//everything for websockets is event driven...

//on a client connection to the server we want to get their ws object
wss.on("connection", (ws) => {
  console.log("New WebSocket connection has been established");

  //this runs when the user who connected sends a message
  ws.on("message", (message) => {
    console.log("We got a message:", message.toString());

    //wrapping in try catch cause JSON.parse can fail if not valid message
    try {
      const data = JSON.parse(message);

      //if the message type is auth meaning we are just trying to verify who user is. we store users id into connection map with their ws object.
      //this will allow us to send messages to that ws object in the future
      if (data.type === "auth") {
        clients.set(data.userId, ws);
        ws.userId = data.userId; //just put userId directly on ws object will make our life easier down below
        console.log(`User ${data.userId} authenticated and stored`);
        console.log(`Total connected users: ${clients.size}`);
      }
    } catch (err) {
      console.error("Error parsing message", err);
    }
  });

  //runs whenever a user disconnects (closed client, etc)
  ws.on("close", () => {
    if (ws.userId) {
      //if ws object that got closes (from client) has a userId attached it was in our map
      clients.delete(ws.userId); //delete it to remove connection (they arent online anymore)
      console.log(`User ${ws.userId} disconnected`);
      console.log(`Total connected users: ${clients.size}`);
    }
  });

  //handle any connection errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
