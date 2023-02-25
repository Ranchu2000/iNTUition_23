import { createServer } from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

//configurables
var timings=["0800","1200","1800"];
var pillToDispense=[false, false, false, false];
var tracking=false;

// Create the https server
const server = createServer();
// Create two instance of the websocket server
//ws1: FrontEnd to WebSocketServer
//ws2: ESP32 to WebSocketServer
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

// Take note of client or users connected
const users = new Set();
const ESP32  = new Set();

class pillState{
  constructor(name, history){
    this.name=name;
    this.tracking=false;
    this.count=0;
    this.freq=1;
    this.timing=[]
    this.dispenseQty=2;
    this.meal=false;
    this.history=history; //{hour:qty taken}-- just 1 month
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
    var day= current.getDate();
    var key= month+','+day;
    if (key in this.history){
      this.history[key]+=1;
    }else{
      this.history[key]=1;
    }
  }
  updateTiming(){
    if (this.freq==1){
      this.timing.push(timings[1]);
    }else if (this.freq==2){
      this.timing.push(timings[0]);
      this.timing.push(timings[2]);
    }else{
      this.timing=timings;
    }
  }
}
var dataState=[]; //4 x pillStates
dataState.push(new pillState("Pill_A", {"1,1": 2, "1,2": 2, "1,3": 1, "1,4": 0, "1,5": 2,}));
dataState.push(new pillState("Pill_B", {"1,1": 6, "1,2": 5, "1,3": 6, "1,4": 4, "1,5": 6, "1.6": 3, "1.7":6}));
dataState.push(new pillState("Pill_C", {"1,1": 2, "1,2": 2, "1,3": 2, "1,4": 1, "1,5": 2,}));
dataState.push(new pillState("Liquid", {"1,1": 4, "1,2": 1, "1,3": 4, "1,4": 3, "1,5": 2,}));
dataState[1].track(30, 3, 2, false)


function mainLogic(){
//logic for pill dispensing
  console.log('running');
  tracking=true; //false by default
  for (var i=0; i<dataState.length; i++){
    if (dataState[i].track){
      tracking==true;
    }
  }
  pillToDispense=[false, false, false, false];
  if (tracking){
      var current = new Date;
      var hour= current.getHours();
      if (hour in timings){
        var Pill_A=0;
        var Pill_B=0;
        var Pill_C=0;
        var Liquid=0;
        var meal= false;
        if (hour in dataState[0].timing && dataState[0].tracking){
          Pill_A=dataState[0].dispenseQty;
          pillToDispense[0]=true;
          if (dataState[0].meal){
            meal=true;
          }
        }else if (hour in dataState[1].timing && dataState[1].tracking){
          Pill_B=dataState[1].dispenseQty;
          pillToDispense[1]=true;
          if (dataState[1].meal){
            meal=true;
          }
        }else if (hour in dataState[2].timing && dataState[2].tracking){
          Pill_C=dataState[2].dispenseQty;
          pillToDispense[2]=true;
          if (dataState[2].meal){
            meal=true;
          }
        }else if (hour in dataState[3].timing && dataState[3].tracking){
          Liquid=dataState[3].dispenseQty;
          pillToDispense[3]=true;
          if (dataState[3].meal){
            meal=true;
          }
        }
        meal= meal?1:0;  //need 1 to be set to true to trigger meal condition
        var message= "0" + "," + Pill_A.toString() + ","+ Pill_B.toString() + ","+ Pill_C.toString()+ ","+ Liquid.toString()+ ","+ meal.toString()
        informESP32(message);
      }
    }
  setTimeout(mainLogic, 5000);
}
mainLogic();

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
    }else if (parseData.type==="refill"){ //data sent is to refill pills==> ONE AT A TIME {type:"refill", refill: qty}
      console.log(`Refill: ${parseData.refill}`)
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
    }else if (parseData.type==="setting"){ // {type:"setting", timings: [string, string ,string]}
      console.log(`Timings: ${parseData.timings}`)
      timings= parseData.timings;
      for (var i=0; i<dataState.length; i++){
        dataState[i].updateTiming();
      }
    }else if (parseData.type==="demo"){ //demo function
      informESP32("0,2,3,1,8,1");
      for (var i=0; i<dataState.length; i++){
        dataState[i].dispense();
      }
    }
  })
});

wss2.on("connection", function connection(ws) {
  console.log("wss2:: socket connection ");
  ESP32.add(ws);
  ws.on('message', function message(data) {
    for (var i=0; i<pillToDispense.length; i++){
      if (pillToDispense[i]){
        pillState[i].dispense();
        pillToDispense[i]=false;
      }
    }
    tracking=false;
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

server.listen(8080);

const sendData = () => {
  var data= JSON.stringify(dataState)
  console.log(data);
  for (const user of users) {
    user.socket.send(data);
  }
};

function informESP32(message){
  console.log(message);
  for (const ws of ESP32) {
    ws.send(JSON.stringify(message));
  }
}

function printInfo(){
  console.log(dataState);
}