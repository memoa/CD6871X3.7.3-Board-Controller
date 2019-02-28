/*
 * Arduino Driver for CD6871X3.7.3 Car Radio Front Panel Board
 * Description: 
 *   This program controls output on display of CD6871X3.7.3 board
 *   Program communicates with SC75823E LCD driver chip, through DI, CLK, CE and INH lines
 *   Datasheet for this chip can be found at http://www.picbasic.ru/_fr/13/SC75823e.pdf
 * Author: Dejan Cvijetinovic
 * Date: 22.02.2019
 */

// Communication pinout constants
const int DI = 3; // transfer data
const int CLK = 4; // synchronization clock
const int CE = 5; // chip enable
const int INH = 8; // display off control

// Address for data transmission to CD6871X3.7.3 device
const unsigned char CCB_ADDRESS = 0x41;

void setup() {
  // Setting communication pinouts
  pinMode(DI, OUTPUT);
  pinMode(CLK, OUTPUT);
  pinMode(CE, OUTPUT);
  pinMode(INH, OUTPUT);

  // Initial pinout values
  digitalWrite(INH, 0);
  digitalWrite(CLK, 0);
  digitalWrite(CE, 0);

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  //Serial.setTimeout(10);
  
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  //Serial.write("READY");
  
}

void loop() {
  // --- Command Line Interface ---
  // Commands:
  // a - testing segments one by one
  // b<number> - test specific segment
  //   <number>: char array representing a number between 1 and 156
  // c - clear all segments
  // d<transfer data> - receive set of data and control bits and forward it to device
  //   <transfer data>: array of 20 chars representing data and control bits
  // s - set all segments
  
  // If there's any serial available, read it:
  while (Serial.available() > 0) {
    char c = Serial.read();
    if (c == 'a') // testing segments one by one
      testAllSegments();
    else if (c == 'b') { // test specific segment
      // look for the next valid integer in the incoming serial stream:
      int databit = Serial.parseInt();
      testSegment(databit);
    }
    else if (c == 'c') // clear all segments
      clearAllSegments();
    else if (c == 'd') { // receive set of data and control bits and forward it to device
      unsigned char data[20];
      for (int i = 0; i < 20; ++i) {
        while (Serial.available() == 0) {}
        data[i] = Serial.read();
      }
      serialDataTransfer(data);
    }
    else if (c == 's') // set all segments
      setAllSegments();
    else // other characters are ignored
      char a = Serial.read();
  }
}

/*
 * Function for data transmision to CD6871X3.7.3 device
 * This function sends CCB address bits to device, which must be 0x41 
 * or device will not accept transmitted data.
 * CCB address must be sent in order from lowest bit to highest
 * 1 0 0 0 0 0 1 0
 * After that, function sends 20 bytes of display and control data bits
 * First byte contents of D1 to D8 bits,
 * Second byte contents of D9 to D16 bits
 * ...
 * Last byte consists of D153, D154, D155, D156, DR, SC, BU, *
 * All D bits corresponding to each LCD display segment state (0 - off, 1 - on)
 * Last four bits of this bytes are Control data bits:
 * DR (drive type): 0 - 1/2 bias drive, 1 - 1/3 bias drive
 * SC (display state): 0 - on, 1 - off  
 * BU (mode): 0 - normal mode, 1 - power-saving mode
 * Last bit is reserved. It's state is not important
 */
void serialDataTransfer(unsigned char data[20]) {
  showData(data);
  // Sending CCB address bits
  for (unsigned char b = 0x01; b > 0; b <<= 1) {
    digitalWrite(CLK, 0);
    //delay(1);
    digitalWrite(DI, CCB_ADDRESS & b);
    //delay(1);
    digitalWrite(CLK, 1);
    //delay(1);
  }
  // Sending Display and control data bits
  digitalWrite(CLK, 0);
  //delay(1);
  digitalWrite(CE, 1);
  //delay(1);
  for (int i = 0; i < 20; ++i) {
    for (unsigned char b = 0x80; b > 0; b >>= 1) {
      digitalWrite(CLK, 0);
      //delay(1);
      digitalWrite(DI, data[i] & b);
      //delay(1);
      digitalWrite(CLK, 1);
      //delay(1);
    }
  }
  digitalWrite(CE, 0);
  //delay(1);
  digitalWrite(CLK, 0);
  //delay(0);
  digitalWrite(INH, 1);
  //delay(1);
}

// *** Test functions ***

void clearAllSegments() {
  unsigned char data[] = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
  serialDataTransfer(data);
}

void setAllSegments() {
  unsigned char data[] = "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xf0";
  serialDataTransfer(data);
}

// Testing all display segments one by one in period of 1 second
// Current segment is on while others are off
void testAllSegments() {
  unsigned char data[] = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
  for (int i = 0; i < 20; ++i) {
    for (unsigned char b = 0x80;; b >>= 1) {
      if (i < 19 && b == 0 || i == 19 && b == 4) {
        data[i] = '\0';
        break;
      }
      data[i] = b;
      delay(1000);
      serialDataTransfer(data);
    }
  }
}

// Testing specific segment
// Current segment is on while others are off
// seg: number of segment should be between 1 and 156
void testSegment(int seg) {
  if (seg >= 1 || seg <= 156) {
    unsigned char data[] = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
    data[(seg - 1) / 8] = 0x80 >> ((seg - 1) % 8);
    serialDataTransfer(data);
  }
}

// Sends transfer data array in binary form
void showData(unsigned char data[20]) {
  for (int i = 0; i < 20; ++i) {
    for (unsigned char b = 0x80; b > 0; b >>= 1)
      Serial.write(data[i] & b ? '1' : '0');
    //Serial.write(' ');
  }
  Serial.write('\n');
}
