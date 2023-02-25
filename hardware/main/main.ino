#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

#include<map>
#include<string>

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

bool taken= false;
bool due= false;

const int ANALOG_READ_PIN = 36; // or A0
const int RESOLUTION = 12;      // Could be 9-12

// CHANGE THIS TO ADD YOUR WIFI USERNAME/PASSWORD
const char * WIFI_SSID = "YuFei";
const char * WIFI_PASS = "yufei12345";

//Initialize the JSON data we send to our websocket server
const int capacity = JSON_OBJECT_SIZE(3);

#define USE_SERIAL Serial

std::map<std::string,int> data;

int pillA;
int pillB;
int pillC;
int liquid;
bool meal;

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case WStype_DISCONNECTED:
    USE_SERIAL.printf("[WSc] Disconnected!\n");
    break;
  case WStype_CONNECTED:
    USE_SERIAL.printf("[WSc] Connected to Server: %s\n", payload);
    break;
  case WStype_TEXT:
    USE_SERIAL.printf("[WSc] get text: %s\n", payload);
    interpretMessage(payload);
    break;
  case WStype_BIN:
    USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
    break;
  case WStype_ERROR:
  case WStype_FRAGMENT_TEXT_START:
  case WStype_FRAGMENT_BIN_START:
  case WStype_FRAGMENT:
  case WStype_FRAGMENT_FIN:
  case WStype_PING:
  case WStype_PONG:
    break;
  }
}

void setup()
{
  USE_SERIAL.begin(115200);
  USE_SERIAL.printf("Begin websocket client program....");
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--)
  {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }
  WiFiMulti.addAP(WIFI_SSID, WIFI_PASS);
  USE_SERIAL.printf("Connecting");
  while (WiFiMulti.run() != WL_CONNECTED)
  {
    USE_SERIAL.printf(".");
    delay(100);
  }
  USE_SERIAL.printf("Connected to Wifi!");
  webSocket.begin("172.20.10.4", 8080, "/sendSensorData"); //look at wifi settings to obtain
  webSocket.onEvent(webSocketEvent);
  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  //init data- TO BE REMOVED
  data["expired"]=0; //1 is expired
  data["A"]=1;
  data["B"]=3;
  data["C"]=0;
  data["liquid"]=15;
  data["meal"]=0; //1 is after meal
}

void messageServer()
{
  if (due and taken){
    webSocket.sendTXT("taken"); //indicate to server pills have been issued
    due=false;
  }
}

void interpretMessage(uint8_t * payload) 
{
  //payload returns as (Expired, PillA, PillB, PillC, Liquid, Meal) "0,1,3,0,15,0"
  char *ptr;
  //Serial.printf("%s\n", (char *)payload);
  ptr = strtok((char *)payload, ",");
  Serial.println(String(ptr));
  //check expired- change due and load qty and meal
  if (data["expired"] != 1) {
    due=true;
    pillA= data["A"];
    pillB= data["B"];
    pillC= data["C"];
    liquid= data["liquid"];
    if (data["meal"]==0){
      meal=false; 
    }
    else{
      meal=true;
    }
  }
  else{
    due=false;
  }
}

void dispenseMed(){
  //Serial.printf("dispensing"); //use values of pillA, pillB, pillC and liquid
  if (meal){
    //print warning to eat first
  }
  int randomNum= random(1,10); //wait for press- use if not while
  if (randomNum >0)//logic based on button pressed and time to take
  {
    taken=true; 
  }
  if (taken){
    //dispense all pills accordingly
    //notify server
    messageServer();
  }
}


void loop()
{
  if (due){
    dispenseMed();
  }
  webSocket.loop();
} 
