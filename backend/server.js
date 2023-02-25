import { createServer } from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

//configurables
var onceTiming=["1200"];
var twiceTiming=["1200","1400"];
var thriceTiming=["0800","1200","1800"];

// Create the https server
const server = createServer();
// Create two instance of the websocket server
//ws1: FrontEnd to WebSocketServer
//ws2: ESP32 to WebSocketServer
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

//function to print stuff, send back to front end, logic to do backend
// Take note of client or users connected
const users = new Set();

class pillState{
  constructor(name){
    this.name=name;
    this.tracking=false;
    this.count=0;
    this.freq=1;
    this.dispenseQty=2;
    this.meal=false;
    this.history={}; //{hour:qty taken}-- just 1 month
  }
  track(count,freq,dispenseQty,meal){
    this.tracking=true;
    this.count=count;
    this.freq=freq;
    this.dispenseQty=dispenseQty;
    this.meal=meal;
  }
  refill(qty){
    this.count+=qty;
  }
  dispense(){
    this.count-=this.dispenseQty;
    var current = new Date;
    var month= current.getMonth();
    var hour= current.getDate();
    var key= month+','+hour;
    //console.log(current.getHours());
    if (key in this.history){
      this.history[key]+=1;
    }else{
      this.history[key]=1;
    }
  }
}
var dataState=[]; //4 x pillStates
dataState.push(new pillState("Pill_A"));
dataState.push(new pillState("Pill_B"));
dataState.push(new pillState("Pill_C"));
dataState.push(new pillState("Liquid"));

wss1.on("connection", function connection(socket) {
  console.log("wss1:: User connected");
  const userRef = {
    socket: socket,
    connectionDate: Date.now(),
  };
  users.add(userRef);

  socket.on('message', function message (data){
    const parseData = JSON.parse(data);
    if (parseData==="import"){
      sendData(); //send import to get data
    }else{ //data sent is to update State
      switch (data.name){
        case "A":
          dataState[0].track(data.count, data.freq, data.dispenseQty, data.meal);
          break;
        case "B":
          dataState[1].track(data.count, data.freq, data.dispenseQty, data.meal);
          break;
        case "C":
          dataState[2].track(data.count, data.freq, data.dispenseQty, data.meal);
          break;
        case "L":
          dataState[3].track(data.count, data.freq, data.dispenseQty, data.meal);
          break;  
      }
    }
  })
});


wss2.on("connection", function connection(ws) {
  console.log("wss2:: socket connection ");
  //ESP32.add(ws);
  informESP32(ws,"text");
  ws.on('message', function message(data) {
      const now = Date.now();
     console.log(now.getDay());
     //informESP32(ws,"text");
  });
});

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
const sendData = () => {
  var data= JSON.stringify(dataState)
  console.log(data);
  for (const user of users) {
    user.socket.send(data);
  }
};

function informESP32(ws, message){
  var dataStr="0,1,3,0,15,0"
  ws.send(JSON.stringify(dataStr));
  return;
}

function printInfo(){
  console.log(dataState);
}