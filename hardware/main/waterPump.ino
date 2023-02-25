#include <LiquidCrystal_I2C.h>
#include <Stepper.h>
// set the LCD number of columns and rows
int lcdColumns = 16;
int lcdRows = 2;

// set LCD address, number of columns and rows
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  


#define RELAY_PIN 27 // ESP32 pin GIOP27, which connects to the IN pin of relay
#define BUTTON_PIN 18
#define PRIME_TIME 10000 
#define DEBOUNCE_TIME 50
#define IN1 19
#define IN2 23
#define IN3 5
#define IN4 4

//set up steps per revolution
const int stepsPerRevolution=2048; // need to change based on requirement @shawn
int lastSteadyState = LOW;
int lastFlickerableState=LOW;
int currentState;

Stepper myStepper(stepsPerRevolution, IN1, IN3, IN2, IN4);

unsigned long lastDebounceTime=0;


// the setup function runs once when you press reset or power the board
void setup() {
  Serial.begin(115200);
  // initialize digital pin GIOP27 as an output.
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Startup");
  delay(2000);
  lcd.clear();
  myStepper.setSpeed(5);

  prime();
}

// the loop function runs over and over again forever
void loop() {
  currentState = digitalRead(BUTTON_PIN);
  lcd.setCursor(0,0);
  lcd.print("Standby");


  if (currentState!= lastFlickerableState){
    lastDebounceTime=millis();
    lastFlickerableState=currentState;
  }

  if ((millis()-lastDebounceTime) > DEBOUNCE_TIME) {
    if (lastSteadyState==HIGH && currentState == LOW){
      Serial.println("Button Press");
//      deliverDose(5);
        deliverPill();
    }
    else if (lastSteadyState==LOW && currentState==HIGH){
      Serial.println("Button release");
    }
    lastSteadyState = currentState;
  }
}

void deliverPill(){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Pill dispense...");
  myStepper.step(stepsPerRevolution);
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
