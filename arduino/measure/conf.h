// These are the interrupt and control pins
#define ADAFRUIT_CC3000_IRQ   3  // MUST be an interrupt pin!
// These can be any two pins
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10
// Use hardware SPI for the remaining pins
// On an UNO, SCK = 13, MISO = 12, and MOSI = 11

// Sensors
#define DHT22_PIN A0
#define WATER_SENSOR 8
#define LUM_PIN A1



#define IDLE_TIMEOUT_MS  3000      // Amount of time to wait (in milliseconds) with no data 
                                   // received before closing the connection.  If you know the server
                                   // you're accessing is quick to respond, you can reduce this value.

// What page to grab!
#define WEBSITE      "server-to-push-data"
#define WEBPAGE      "/path"


#define DAY_DEFAULT_DELAY 600000
#define NIGHT_DEFAULT_DELAY 6000000
#define LUMINANCE_THRESHOLD 5
