import { createServer } from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

//configurables
var timings=["0800","1200","1800"];

// Create the https server
const server = createServer();
// Create two instance of the websocket server
//ws1: FrontEnd to WebSocketServer
//ws2: ESP32 to WebSocketServer
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

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
    var hour= current.getHours();
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

//logic for pill dispensing
var tracking=true;
var maxFreq=0;
var monitor=[];
for (var i=0; i<dataState.length; i++){
  if (dataState[i].freq==1 && dataState[i].track){
    if (maxFreq==0){
      maxFreq=1;
    }
  }else if (dataState[i].freq==2 && dataState[i].track){
    if (maxFreq<=1){
      maxFreq=2;
    }
  }else if (dataState[i].freq==3 && dataState[i].track){
    if (maxFreq<=2){
      maxFreq=3;
    };
  }
  if (dataState[i].track){
    tracking==true;
  }
}

if (tracking){
  var current = new Date;
  var hour= current.getHours();
  
  if (maxFreq==1){
    monitor.push(timings[1]);
  }else if (maxFreq==2){
    monitor.push(timings[0]);
    monitor.push(timings[2]);
  }
  else{
    monitor==timings;
  }
  //console.log(timings.indexOf("1200"));
  if (hour in monitor){
    var index= timings.indexOf(hour);// 0 mapped to 1 and 3, 1 mapped to 2,3, 3 mapped to all
    //some pill needs to be dispensed (Expired, PillA, PillB, PillC, Liquid, Meal)
    var dataStr="0,1,3,0,15,0" 
  }
}

wss1.on("connection", function connection(socket) {
  console.log("wss1:: User connected");
  const userRef = {
    socket: socket,
    connectionDate: Date.now(),
  };
  users.add(userRef);
  socket.on('message', function message (data){
    const parseData = JSON.parse(data);
    if (parseData.type==="import"){ //{"import"}
      sendData(); //send import to get data
    }else if (parseData.type==="init"){ //data sent is to update State==> ONE AT A TIME {type:"init", count: qty, freq: qty, dispenseQty: qty, meal: bool}
      switch (parseData.name){
        case "A":
          dataState[0].track(parseData.count, parseData.freq, parseData.dispenseQty, parseData.meal);
          break;
        case "B":
          dataState[1].track(parseData.count, parseData.freq, parseData.dispenseQty, parseData.meal);
          break;
        case "C":
          dataState[2].track(parseData.count, parseData.freq, parseData.dispenseQty, parseData.meal);
          break;
        case "L":
          dataState[3].track(parseData.count, parseData.freq, parseData.dispenseQty, parseData.meal);
          break;  
      }
    }else if (parseData.type=="refill"){ //data sent is to refill pills==> ONE AT A TIME {type:"refill", refill: qty}
      switch (parseData.name){
        case "A":
          dataState[0].refill(parseData.refill);
          break;
        case "B":
          dataState[1].refill(parseData.refill);
          break;
        case "C":
          dataState[2].refill(parseData.refill);
          break;
        case "L":
          dataState[3].refill(parseData.refill);
          break;  
      }
    }else if (parseData.type=="setting"){ // {type:"setting", refill: [string, string ,string]}
      timings= parseData.timings;
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