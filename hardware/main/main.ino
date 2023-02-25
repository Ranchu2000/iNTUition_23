#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include<map>
#include <LiquidCrystal_I2C.h>
#include <Stepper.h>

#define RELAY_PIN 27 // ESP32 pin GIOP27, which connects to the IN pin of relay
#define BUTTON_PIN 18
#define PRIME_TIME 10000 
#define DEBOUNCE_TIME 50
#define IN1 19
#define IN2 23
#define IN3 5
#define IN4 4
#define IN5 35
#define IN6 32
#define IN7 33
#define IN8 25


//set up steps per revolution
const int stepsPerRevolution=2048; // need to change based on requirement @shawn

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
// set the LCD number of columns and rows
int lcdColumns = 16;
int lcdRows = 2;

// debounce mitigation for switch
int lastSteadyState = LOW;
int lastFlickerableState=LOW;
int currentState;
unsigned long lastDebounceTime=0;


// set LCD address, number of columns and rows
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

bool taken= false;
bool due= false;

const int ANALOG_READ_PIN = 36; // or A0
const int RESOLUTION = 12;      // Could be 9-12

// CHANGE THIS TO ADD YOUR WIFI USERNAME/PASSWORD
const char * WIFI_SSID = "Xiaomi_7660";
const char * WIFI_PASS = "spaghetti";

//Initialize the JSON data we send to our websocket server
const int capacity = JSON_OBJECT_SIZE(3);

// initialize the stepper library
Stepper myStepperA(stepsPerRevolution, IN1, IN3, IN2, IN4);
Stepper myStepperB(stepsPerRevolution, IN5, IN6, IN7, IN8);


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
    interpretMessage(payload); // either dispense or dont dispense medicine
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

    // initialize digital pin GIOP27 as an output.
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  // set the speed at 5 rpm
  myStepperA.setSpeed(10);
  myStepperA.setSpeed(10);
  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Startup");
  delay(2000);
  lcd.clear();
  prime();

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
  int toDispense=0;

  if (!due){
    toDispense = timeForMedNotif();
  }
  else{
    // pills overdue, dont dispense anything (ie do nothing)
  }

  if (toDispense){
    // dispense all pills according to data above
    deliverDose(liquid); // dispense the liquid
    deliverPillA(pillA); // dispense all pills
    deliverPillB(pillB);
  }
  else{
    Serial.println("not dispensed");
  }

}

int timeForMedNotif(){
  taken=0;
  //Serial.printf("dispensing"); //use values of pillA, pillB, pillC and liquid
  if (meal){
    //print warning to eat first
    Serial.println("Press dispense if you have eaten.");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Food required.");
    lcd.setCursor(0,1);
    lcd.print("Dispense?");

  }
  else{
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Med Time!");
    lcd.setCursor(0,1);
    lcd.print("Dispense?");
  }

  
  int count = 0;

  while(!taken and count<50000000){ // about 10-15 seconds
      currentState = digitalRead(BUTTON_PIN);
     if (currentState!= lastFlickerableState){
    lastDebounceTime=millis();
    lastFlickerableState=currentState;
  }

  if ((millis()-lastDebounceTime) > DEBOUNCE_TIME) {
    if (lastSteadyState==HIGH && currentState == LOW){
      Serial.println("Button Press");
      taken=1;
    }
    else if (lastSteadyState==LOW && currentState==HIGH){
      Serial.println("Button release");
    }
    lastSteadyState = currentState;
  }
    count++;
  }

  lcd.clear();
  
   
 

  if (taken){
    //dispense all pills accordingly
    //notify server
    messageServer();
    return 1;
  }
  else{
    return 0;

  }

}

void deliverPillA(int number){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("PillA dispense...");
  myStepperA.step(stepsPerRevolution * number);
  delay(1000);
  lcd.clear();
  lcd.print("Pills dispensed.");
  delay(1000);
  lcd.clear();
}

void deliverPillB(int number){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("PillB dispense...");
  myStepperB.step(stepsPerRevolution * number);
  delay(1000);
  lcd.clear();
  lcd.print("Pills dispensed.");
  delay(1000);
  lcd.clear();
}




void deliverDose(int dosage){
  int timeOfOperation = 565 * dosage;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Delivering Dose...");
  Serial.println("Delivering Dose...");
  digitalWrite(RELAY_PIN, HIGH);
  delay(timeOfOperation);
  digitalWrite(RELAY_PIN, LOW);
  lcd.clear();
  lcd.print("Dose Delivered.");
  delay(1000);
  lcd.clear();
  Serial.println("Dose Delivered.");
}

void prime(){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Priming...");
  digitalWrite(RELAY_PIN, HIGH);
  delay(PRIME_TIME);
  digitalWrite(RELAY_PIN,LOW);
  delay(5000);
  Serial.println("Device has been primed.");
  lcd.clear();
  lcd.print("Primed.");
  delay(1000);
}

void loop(){
  currentState = digitalRead(BUTTON_PIN);
//  interpretMessage(payload);
  
  lcd.setCursor(0,0);
  lcd.print("Standby");
  webSocket.loop();
} 
