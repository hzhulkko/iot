/*************************************************** 
  This is an example for the Adafruit CC3000 Wifi Breakout & Shield

  Designed specifically to work with the Adafruit WiFi products:
  ----> https://www.adafruit.com/products/1469

  Adafruit invests time and resources providing this open source code, 
  please support Adafruit and open-source hardware by purchasing 
  products from Adafruit!

  Written by Limor Fried & Kevin Townsend for Adafruit Industries.  
  BSD license, all text above must be included in any redistribution
 ****************************************************/

#include <Adafruit_CC3000.h>
#include <ccspi.h>
#include <SPI.h>
#include <string.h>
#include "utility/debug.h"
#include <dht.h>
#include <avr/wdt.h>
#include "conf.h"
#include "wlan_conf.h"

Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT, SPI_CLOCK_DIVIDER);
dht DHT;

int g_session_length;
long g_last_delay;
long g_delay;
float g_lum_running_avg;
bool g_night_mode;

void setup(void)
{
  pinMode(WATER_SENSOR, INPUT);
  
  g_session_length = 0;
  g_delay = DAY_DEFAULT_DELAY;
  g_lum_running_avg = 10;
  g_night_mode = false;
  g_last_delay = g_delay;

  Serial.begin(115200);
  Serial.println(F("Hello, CC3000!\n")); 
  
  /* Initialise the module */
  Serial.println(F("\nInitializing..."));
  if (!cc3000.begin())
  {
    Serial.println(F("Couldn't begin()! Check your wiring?"));
    while(1);
  }
  
  Serial.print(F("\nAttempting to connect to ")); Serial.println(WLAN_SSID);
  if (!cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SECURITY)) {
    Serial.println(F("Failed!"));
    while(1);
  }
   
  Serial.println(F("Connected!"));
  
  /* Wait for DHCP to complete */
  Serial.println(F("Request DHCP"));
  while (!cc3000.checkDHCP())
  {
    delay(100); // ToDo: Insert a DHCP timeout!
  }  

  /* Display the IP address DNS, Gateway, etc. */  
  while (! hasConnection()) {
    delay(1000);
  } 
}

void loop(void)
{
  // Start watchdog 
  wdt_enable(WDTO_8S); 
  
  // Get IP
  uint32_t ip = 0;
  Serial.print(WEBSITE); Serial.print(F(" -> "));
  while (ip == 0) {
    if (! cc3000.getHostByName(WEBSITE, &ip)) {
      Serial.println(F("Couldn't resolve!"));
    }
    delay(500);
  } 
  cc3000.printIPdotsRev(ip);
  Serial.println(F(""));
  
  // Get data
  char humstr[10];
  char tempstr[10];
  //char lumstr[10];
  int ok = measureDHT();
  int water = waterLevel();
  int luminance = analogRead(LUM_PIN);
  //float lum = 3.3*analogRead(LUM_PIN)/1023;
  
  while(!(ok == 1)) {
    ok = measureDHT();
  }
  dtostrf(DHT.humidity, 2, 1, humstr);
  dtostrf(DHT.temperature, 2, 1, tempstr);
  //dtostrf(lum, 2, 1, lumstr);

  int length = 0;
  wdt_reset();
  
  // Check connection to WiFi
  Serial.print(F("Checking WiFi connection ..."));
  if(!cc3000.checkConnected()){while(1){}}
  Serial.println(F("done."));
  wdt_reset();
  
  String msg = "";
  msg = msg + "main_unit_id=5559f243ec7d4f0300ed2d58&humidity=" + humstr + "&temperature=" + tempstr + "&water_level=" + String(water) + "&light=" + String(luminance);
  length = msg.length();
  
  // Send request
  Adafruit_CC3000_Client client = cc3000.connectTCP(ip, 80);
  if (client.connected()) {
    Serial.println(F("Connected to server."));
    sendData(client, msg, length);
    wdt_reset();
    
    //printData(msg, length);
    wdt_reset();
    
  } else {
    Serial.println(F("Connection failed"));    
    return;
  }
  wdt_reset();
  

  readResponse(client);
  wdt_reset();
   
  // Close connection and disconnect
  client.close();
  Serial.println(F("Closing connection"));
  
  // Reset watchdog & disable
  wdt_reset();
  wdt_disable();
  
  // checkAndAdjustDelay(luminance); 
  wait(g_delay);
  
}

// Send data
void sendData(Adafruit_CC3000_Client& client, String msg, int length) 
{

  Serial.println(F("Sending headers "));
  client.fastrprint(F("POST ")); client.fastrprint(WEBPAGE); client.fastrprint(F(" HTTP/1.1\r\n"));
  client.fastrprint(F("Host: ")); client.fastrprint(WEBSITE); client.fastrprint(F("\r\n"));
  client.fastrprint(F("Content-Length: ")); client.print(length); client.fastrprint(F("\r\n"));
  client.fastrprintln(F("Content-Type: application/x-www-form-urlencoded"));
  client.fastrprintln(F("Connection: close"));
  Serial.println(F(" done."));

  Serial.print(F("Sending data ..."));
  client.fastrprintln(F(""));    
  client.print(msg);
  client.fastrprintln(F(""));
  Serial.println(F("done."));
}

// print HTTP request
void printData(String msg, int length) 
{
  
  Serial.print(F("POST ")); Serial.print(WEBPAGE); Serial.print(F(" HTTP/1.1\r\n"));
  Serial.print(F("Host: ")); Serial.print(WEBSITE); Serial.print(F("\r\n"));
  Serial.print(F("Content-Length: ")); Serial.print(length); Serial.print(F("\r\n"));
  Serial.println(F("Content-Type: application/x-www-form-urlencoded"));
  Serial.println(F("Connection: close"));
  Serial.println(msg);
}

// Read answer from server
void readResponse(Adafruit_CC3000_Client& client) {
  Serial.println(F("Reading answer ..."));
  while (client.connected()) {
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
    }
  }
}

// Wait for a given time using the watchdog
void wait(long total_delay) 
{

  long number_steps = (long)(total_delay/5000L);
  wdt_enable(WDTO_8S);
  for (long i = 0; i < number_steps; i++){
    delay(5000);
    wdt_reset();
  }
  wdt_disable(); 
}

int measureDHT(void) 
{
  int chk = DHT.read22(DHT22_PIN);
  switch (chk) {
    case DHTLIB_OK:  
		Serial.print("OK,\t"); 
		return 1;
    case DHTLIB_ERROR_CHECKSUM: 
		Serial.print("Checksum error,\t"); 
		break;
    case DHTLIB_ERROR_TIMEOUT: 
		Serial.print("Time out error,\t"); 
		break;
    default: 
		Serial.print("Unknown error,\t"); 
		break;
  }
  return 0;
}

int waterLevel(void)
{
  if(digitalRead(WATER_SENSOR) == LOW) {
    return 1;
  }
  return 0;
}

bool hasConnection(void)
{
  uint32_t ipAddress, netmask, gateway, dhcpserv, dnsserv;
  
  if(!cc3000.getIPAddress(&ipAddress, &netmask, &gateway, &dhcpserv, &dnsserv))
  {
    Serial.println(F("Unable to retrieve the IP Address!\r\n"));
    return false;
  }
  else
  {
    Serial.print(F("\nIP Addr: ")); cc3000.printIPdotsRev(ipAddress);
    Serial.print(F("\nNetmask: ")); cc3000.printIPdotsRev(netmask);
    Serial.print(F("\nGateway: ")); cc3000.printIPdotsRev(gateway);
    Serial.print(F("\nDHCPsrv: ")); cc3000.printIPdotsRev(dhcpserv);
    Serial.print(F("\nDNSserv: ")); cc3000.printIPdotsRev(dnsserv);
    Serial.println();
    return true;
  }
}

// Adjust delay according to lightness
void checkAndAdjustDelay(int luminance) {
  g_lum_running_avg = (g_lum_running_avg * 0.3) + (luminance * 0.7);

  //Serial.print(F("Current running average: "));
  //Serial.println(g_lum_running_avg);
  //Serial.print(F("Current delay: "));
  //Serial.println(g_delay);  

  if (g_lum_running_avg < LUMINANCE_THRESHOLD) {
    Serial.println("NIGHT MODE!");
    g_last_delay = g_delay;
    g_delay = NIGHT_DEFAULT_DELAY;
    g_night_mode = true;
  }
  else {
    Serial.println("DAY MODE!");
    g_delay = g_last_delay;
    g_night_mode = false;
  }

  if (g_night_mode == false) {
    g_session_length++;
    if (g_session_length % 100) {
      g_delay = g_delay * 0.5;
    }
  }
}



