import { createServer } from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

// Create the https server
const server = createServer();
// Create two instance of the websocket server

//ws1: FrontEnd to WebSocketServer
//ws2: ESP32 to WebSocketServer
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

// Take note of client or users connected
const users = new Set();


/*For the first connection "/request" path
 We take note of the clients that initiated connection and saved it in our list
 */
wss1.on("connection", function connection(socket) {
  console.log("wss1:: User connected");
  const userRef = {
    socket: socket,
    connectionDate: Date.now(),
  };
  console.log("Adding to set");
  users.add(userRef);
});

/*
 For the second connection "/sendSensorData" path
 This is where we received the sensor reads from the ESP32 Dev module.
 Upon receiving the sensor read, we broadcast it to all the client listener
*/
wss2.on("connection", function connection(ws) {
  console.log("wss2:: socket connection ");
  //ESP32.add(ws);
  informESP32(ws,"text");
  ws.on('message', function message(data) {
      const now = Date.now();
      //const parseData = JSON.parse(data);
      //var data= parseData.split();
      
      //let taken={date: now}
      //sendMessage(jsonMessage);
      //save history into database?
     console.log(now);
     //informESP32(ws,"text");
  });

});


/*
This is the part where we create the two paths.  
Initial connection is on HTTP but is upgraded to websockets
The two path "/request" and "/sendSensorData" is defined here
*/
server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);
  console.log(`Path name ${pathname}`);

  if (pathname === "/request") {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit("connection", ws, request);
    });
  } else if (pathname === "/sendSensorData") {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});
//Open the server port in 8080
server.listen(8080);

//function to send websocket messages to user
const sendMessage = (message) => {
  // console.log("Sending messages to users!");
  for (const user of users) {
    user.socket.send(message);
  }
};

function informESP32(ws, message){
  var dataStr="0,1,3,0,15,0"
  ws.send(JSON.stringify(dataStr));
  return;
}
