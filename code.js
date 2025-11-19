// Automatic Plant Watering System
// Variables
let moisture = 0
let moistureLevel = 0
let pumpRunning = false
let dryThreshold = 400  // Adjustable threshold (0-1023)
let wateringTime = 2000 // Watering duration in milliseconds

// Pins
let moistureSensor = AnalogPin.P1
let pumpRelay = DigitalPin.P2
let buttonAdjust = DigitalPin.P0

// Setup
basic.forever(function () {
    // Read moisture sensor (0-1023)
    // Lower values = wetter soil, Higher values = drier soil
    moisture = pins.analogReadPin(moistureSensor)
    
    // Convert to percentage for display (0-100%)
    moistureLevel = Math.map(moisture, 0, 1023, 100, 0)
    moistureLevel = Math.constrain(moistureLevel, 0, 100)
    
    // Display moisture level
    if (moistureLevel < 30) {
        basic.showIcon(IconNames.Happy)  // Wet - happy plant
    } else if (moistureLevel < 60) {
        basic.showIcon(IconNames.Yes)    // Good - OK plant
    } else {
        basic.showIcon(IconNames.Sad)    // Dry - sad plant
    }
    
    // Check if soil is too dry
    if (moisture > dryThreshold && !pumpRunning) {
        startWatering()
    }
    
    basic.pause(1000) // Check every second
})

// Watering function
function startWatering() {
    pumpRunning = true
    basic.showString("WATERING")
    
    // Turn pump on
    pins.digitalWritePin(pumpRelay, 1)
    
    // Water for specified time
    basic.pause(wateringTime)
    
    // Turn pump off
    pins.digitalWritePin(pumpRelay, 0)
    
    pumpRunning = false
    basic.showIcon(IconNames.Yes)
}

// Adjust dry threshold with button A
input.onButtonPressed(Button.A, function () {
    dryThreshold = Math.max(200, dryThreshold - 50)  // Make it easier to trigger watering
    basic.showNumber(dryThreshold / 10)
    basic.pause(1000)
})

// Adjust dry threshold with button B
input.onButtonPressed(Button.B, function () {
    dryThreshold = Math.min(800, dryThreshold + 50)  // Make it harder to trigger watering
    basic.showNumber(dryThreshold / 10)
    basic.pause(1000)
})

// Show current moisture level when shaking
input.onGesture(Gesture.Shake, function () {
    basic.showNumber(Math.round(moistureLevel))
    basic.pause(2000)
})

// Show current threshold on start
basic.showString("THRESH:")
basic.showNumber(dryThreshold / 10)
basic.pause(2000)
