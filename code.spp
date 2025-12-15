// ===================================
// 1. GLOBAL CONSTANTS AND VARIABLES
// ===================================

const int sensorPin = A0; // Moisture sensor pin (Analog 0)
const int pumpPin = 9; // TIP120 control pin (Digital 9)

// Higher reading = drier soil
const int DRY_START = 700; // Start pump when soil is dry enough (>= 700)
const int WET_STOP = 500; // Stop pump when soil is wet enough (<= 500)

// Timing Variables
unsigned long pumpStartTime = 0;
const unsigned long maxPumpTime = 60000; // Pump runs max 60 seconds
const unsigned long cooldownTime = 30000; // Wait 30 seconds after pumping
unsigned long lastPumpEnd = 0;

bool pumpRunning = false; // Track pump state

// ===================================
// 2. SETUP FUNCTION
// ===================================

void setup() {
Serial.begin(9600);
pinMode(pumpPin, OUTPUT);
digitalWrite(pumpPin, LOW); // Ensure pump is OFF at startup
}

// ===================================
// 3. MAIN LOOP FUNCTION (Hysteresis Logic)
// ===================================

void loop() {
unsigned long currentTime = millis();
int moisture = analogRead(sensorPin);

// Debugging output
Serial.print("Moisture: ");
Serial.print(moisture);
Serial.print(" | Pump State: ");
Serial.println(pumpRunning ? "ON" : "OFF");

// ----------------------------------------
// LOGIC BLOCK 1: If Pump is currently ON
// ----------------------------------------
if (pumpRunning) {
// Stop if max time reached
if (currentTime - pumpStartTime >= maxPumpTime) {
digitalWrite(pumpPin, LOW);
pumpRunning = false;
lastPumpEnd = currentTime;
Serial.println(">>> STOPPING PUMP (Time Limit)");
return;
}

// Stop if soil is wet enough (lower reading = wetter)
if (moisture <= WET_STOP) {
  digitalWrite(pumpPin, LOW);
  pumpRunning = false;
  lastPumpEnd = currentTime;
  Serial.println(">>> STOPPING PUMP (Soil Wet Enough)");
  return;
}

// Keep running; do not check cooldown while ON
delay(500);
return;

}

// ----------------------------------------
// LOGIC BLOCK 2: If Pump is OFF
// ----------------------------------------

// Cooldown after last pump
if (currentTime - lastPumpEnd < cooldownTime) {
Serial.println("Cooldown in effect. Waiting...");
delay(500);
return;
}

// Start if soil is dry enough (higher reading = drier)
if (moisture >= DRY_START) {
Serial.println(">>> STARTING PUMP (Soil Dry)");
digitalWrite(pumpPin, HIGH);
pumpRunning = true;
pumpStartTime = currentTime;
} else {
Serial.println("Soil wet or adequate. Pump remains OFF.");
digitalWrite(pumpPin, LOW);
}

delay(500); // Small delay for stability
}
