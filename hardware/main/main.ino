#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
//#include <stdlib.h>

#include<map>
//#include<string>

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

bool taken= false;
bool due= false;

const int ANALOG_READ_PIN = 36; // or A0
const int RESOLUTION = 12;      // Could be 9-12

// CHANGE THIS TO ADD YOUR WIFI USERNAME/PASSWORD
const char * WIFI_SSID = "Xiaomi_7660";
const char * WIFI_PASS = "spaghetti";

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
  webSocket.begin("192.168.31.7", 8080, "/sendSensorData"); //look at wifi settings to obtain
  webSocket.onEvent(webSocketEvent);
  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

}

void messageServer()
{
    webSocket.sendTXT("taken"); //indicate to server pills have been issued
}

void interpretMessage(uint8_t * payload) 
{
  //payload returns as (Expired, PillA, PillB, PillC, Liquid, Meal) "0,1,3,0,15,0"
  int *data = (int*) malloc(sizeof(int)*6);

  int num=0;
  char *token = strtok((char*) payload, ",");
  for (int i=1; token[i]!='\0';i++){
    num = num*10 + (token[i]-48);
  }

  data[0] = num;
  for (int i=1; i<5; i++){
    token = strtok(NULL,",");
    int num = 0;
    for (int i = 0; token[i] != '\0'; i++) {
      num = num * 10 + (token[i] - 48);
      }
      data[i] = num;

  }
  
  token = strtok(NULL,",");
  num = token[0]-48;

  data[5] = num;

  due=data[0];
  pillA=data[1];
  pillB=data[2];
  pillC=data[3];
  liquid=data[4];
  meal=data[5];

  if (!due){
    toDispense = timeForMedNotif();
  }
  else{
    // pills overdue, dont dispense anything (ie do nothing)
  }

  if (toDispense){
    // dispense all pills according to data above
  }

}

int timeForMedNotif(){
  //Serial.printf("dispensing"); //use values of pillA, pillB, pillC and liquid
  if (meal){
    //print warning to eat first
    Serial.println("Press dispense if you have eaten.");
  }

  if (taken){
    //dispense all pills accordingly
    //notify server
    messageServer();
    return 1;
  }
}


void loop()
{
  if (due){
    dispenseMed();
  }
  webSocket.loop();
} 
