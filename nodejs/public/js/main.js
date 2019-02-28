/*
  CD6871X373 Client Application Script
  Description:
    Script for client application interface
    Configuring transfer data array by clicking on SVG elements
    and forwarding array to node server through socket.io
  Author: Dejan Cvijetinovic
  Date: 26.02.2019
*/

// Load socket.io-client and connect to the host that serves the page
var socket = io();

// Defining display segments, getting SVG elements, corresponding to
// it's position in transfer data array
var segments = [
  document.getElementById('amp'), // bit D1
  document.getElementById('dig1f'), // bit D2
  document.getElementById('dig1e'), // bit D3
  document.getElementById('dig1m'), // bit D4
  document.getElementById('dig1h'), // bit D5
  document.getElementById('dig1g1'), // bit D6
  document.getElementById('dig1d'), // bit D7
  document.getElementById('dig1a'), // bit D8
  document.getElementById('dig1il'), // bit D9
  document.getElementById('dig1k'), // bit D10
  document.getElementById('dig1j'), // bit D11
  document.getElementById('dig1g2'), // bit D12
  undefined, // bit D13
  document.getElementById('dig1b'), // bit D14
  document.getElementById('dig1c'), // bit D15
  document.getElementById('dig9a'), // bit D16
  document.getElementById('dig2f'), // bit D17
  document.getElementById('dig2e'), // bit D18
  document.getElementById('dig2m'), // bit D19
  document.getElementById('dig2h'), // bit D20
  document.getElementById('dig2g1'), // bit D21
  document.getElementById('dig2d'), // bit D22
  document.getElementById('dig2a'), // bit D23
  document.getElementById('dig2il'), // bit D24
  document.getElementById('dig2k'), // bit D25
  document.getElementById('dig2j'), // bit D26
  document.getElementById('dig2g2'), // bit D27
  document.getElementById('AF'), // bit D28
  document.getElementById('dig2b'), // bit D29
  document.getElementById('dig2c'), // bit D30
  document.getElementById('dig9b'), // bit D31
  document.getElementById('dig3f'), // bit D32
  document.getElementById('dig3e'), // bit D33
  document.getElementById('dig3m'), // bit D34
  document.getElementById('dig3h'), // bit D35
  document.getElementById('dig3g1'), // bit D36
  document.getElementById('dig3d'), // bit D37
  document.getElementById('dig3a'), // bit D38
  document.getElementById('dig3il'), // bit D39
  document.getElementById('dig3k'), // bit D40
  document.getElementById('dig3j'), // bit D41
  document.getElementById('dig3g2'), // bit D42
  document.getElementById('TA'), // bit D43
  document.getElementById('dig3b'), // bit D44
  document.getElementById('dig3c'), // bit D45
  document.getElementById('dig9g'), // bit D46
  document.getElementById('dig4f'), // bit D47
  document.getElementById('dig4e'), // bit D48
  document.getElementById('dig4m'), // bit D49
  document.getElementById('dig4h'), // bit D50
  document.getElementById('dig4g1'), // bit D51
  document.getElementById('dig4d'), // bit D52
  document.getElementById('dig4a'), // bit D53
  document.getElementById('dig4il'), // bit D54
  document.getElementById('dig4k'), // bit D55
  document.getElementById('dig4j'), // bit D56
  document.getElementById('dig4g2'), // bit D57
  document.getElementById('TP'), // bit D58
  document.getElementById('dig4b'), // bit D59
  document.getElementById('dig4c'), // bit D60
  document.getElementById('dig9c'),  // bit D61
  document.getElementById('dig5f'), // bit D62
  document.getElementById('dig5e'), // bit D63
  document.getElementById('dig5m'), // bit D64
  document.getElementById('dig5h'), // bit D65
  document.getElementById('dig5g1'), // bit D66
  document.getElementById('dig5d'), // bit D67
  document.getElementById('dig5a'), // bit D68
  document.getElementById('dig5il'), // bit D69
  document.getElementById('dig5k'), // bit D70
  document.getElementById('dig5j'), // bit D71
  document.getElementById('dig5g2'), // bit D72
  undefined, // bit D73
  document.getElementById('dig5b'), // bit D74
  document.getElementById('dig5c'), // bit D75
  undefined, // bit D76
  document.getElementById('dig6f'), // bit D77
  document.getElementById('dig6e'), // bit D78
  document.getElementById('dig6m'), // bit D79
  document.getElementById('dig6h'), // bit D80
  document.getElementById('dig6g1'), // bit D81
  document.getElementById('dig6d'), // bit D82
  document.getElementById('dig6a'), // bit D83
  document.getElementById('dig6il'), // bit D84
  document.getElementById('dig6k'), // bit D85
  document.getElementById('dig6j'), // bit D86
  document.getElementById('dig6g2'), // bit D87
  document.getElementById('dp'), // bit D88
  document.getElementById('dig6b'), // bit D89
  document.getElementById('dig6c'), // bit D90
  document.getElementById('PTY'), // bit D91
  document.getElementById('dig7f'), // bit D92
  document.getElementById('dig7e'), // bit D93
  document.getElementById('dig7m'), // bit D94
  document.getElementById('dig7h'), // bit D95
  document.getElementById('dig7g1'), // bit D96
  document.getElementById('dig7d'), // bit D97
  document.getElementById('dig7a'), // bit D98
  document.getElementById('dig7il'), // bit D99
  document.getElementById('dig7k'), // bit D100
  document.getElementById('dig7j'), // bit D101
  document.getElementById('dig7g2'), // bit D102
  document.getElementById('dig9d'), // bit D103
  document.getElementById('dig7b'), // bit D104
  document.getElementById('dig7c'), // bit D105
  document.getElementById('dig9e'), // bit D106
  document.getElementById('dig8f'), // bit D107
  document.getElementById('dig8e'), // bit D108
  document.getElementById('dig8m'), // bit D109
  document.getElementById('dig8h'), // bit D110
  document.getElementById('dig8g1'), // bit D111
  document.getElementById('dig8d'), // bit D112
  document.getElementById('dig8a'), // bit D113
  document.getElementById('dig8il'), // bit D114
  document.getElementById('dig8k'), // bit D115
  document.getElementById('dig8j'), // bit D116
  document.getElementById('dig8g2'), // bit D117
  document.getElementById('dig9f'), // bit D118
  document.getElementById('dig8b'), // bit D119
  document.getElementById('dig8c'), // bit D120
  undefined, // bit D121
  document.getElementById('EON'), // bit D122
  document.getElementById('LOUD'), // bit D123
  document.getElementById('diska'), // bit D124
  document.getElementById('diskb'), // bit D125
  document.getElementById('diskc'), // bit D126
  document.getElementById('CLAS'), // bit D127
  document.getElementById('POP'), // bit D128
  document.getElementById('ROCK'), // bit D129
  document.getElementById('lbara'), // bit D130
  document.getElementById('lbarb'), // bit D131
  document.getElementById('lbarc'), // bit D132
  document.getElementById('lbard'), // bit D133
  document.getElementById('lbare'), // bit D134
  document.getElementById('lbarf'), // bit D135
  document.getElementById('lbarg'), // bit D136
  document.getElementById('EQ'), // bit D137
  document.getElementById('mbara'), // bit D138
  document.getElementById('mbarb'), // bit D139
  document.getElementById('mbarc'), // bit D140
  document.getElementById('mbard'), // bit D141
  document.getElementById('mbare'), // bit D142
  document.getElementById('mbarf'), // bit D143
  document.getElementById('mbarg'), // bit D144
  undefined, // bit D145
  document.getElementById('rbara'), // bit D146
  document.getElementById('rbarb'), // bit D147
  document.getElementById('rbarc'), // bit D148
  document.getElementById('rbard'), // bit D149
  document.getElementById('rbare'), // bit D150
  document.getElementById('rbarf'), // bit D151
  document.getElementById('rbarg'), // bit D152
  document.getElementById('CDP'), // bit D153
  document.getElementById('REG'), // bit D154
  document.getElementById('LOC'), // bit D155
  document.getElementById('MONO'), // bit D156
];

// Defining type of transfer data
class Data {
  constructor() {
    // Transfer data array
    // Consists of 156 data bits, 3 control bits and last one bit is reserved
    // Bits are divided into 20 bytes, total 160 bits
    // first byte consists of D1, D2, D3, D4, D5, D6, D7 and D8
    // second byte consists of D9, D10, D11, D12, D13, D14, D15 and D16
    // ...
    // 20th byte consists of D153, D154, D155, D156, DR, SC, BU, and reserved
    this.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
  }
  // Get specific bit from transfer data array
  // bit: value between 1 and 156, according to transfer data bits
  getBit(bit) { 
    return this._data[Math.floor((bit - 1) / 8)] & (0x80 >> ((bit - 1) % 8));
  }
  // Set specific bit to transfer data array
  // bit: value between 1 and 156, according to transfer data bits
  // val: new value for specified bit, 0 or 1
  setBit(bit, val) {
    if (val) // if val is 1, set data transfer bit to 1
      this._data[Math.floor((bit - 1) / 8)] |= 0x80 >> ((bit - 1) % 8);
    else // if val is 0, set data transfer bit to 0
      this._data[Math.floor((bit - 1) / 8)] &= ~(0x80 >> ((bit - 1) % 8));
  }
}
var data_array; // transfer data

window.addEventListener("load", function() { // when page loads
  data_array = new Data();
  socket.emit("transfer_data", data_array.data); // Turn off all segments - device

  // Initializing display segments
  for (let i = 0; i < 156; ++i) {
    // Skipping undefined data transfer bits
    if (i == 12 || i == 72 || i == 75 || i == 120 || i == 144) continue;
    // Turning segments off - style
    // If selected segment have 2 parts (lbarc, lbare, mbarc, mbare, rbarc or mbare)
    if (i == 131 || i == 133 || i == 139 || i == 141 || i == 147 || i == 149) {
      segments[i].childNodes[1].style.fillOpacity = 0.1; // first part of segment
      segments[i].childNodes[3].style.fillOpacity = 0.1; // second part of segment
    }
    // If selected segment have one part (rest of segments)
    else
      segments[i].style.fillOpacity = 0.1;
    // Add event listener for display segments - segment toggling
    segments[i].addEventListener("click", function() {
      // If segment is on, turn it off - check it in data transfer array
      if (data_array.getBit(i + 1)) {
        // Turning segment off - data transfer array
        data_array.setBit(i + 1, 0);
        // Turning segment off - style
        // If selected segment have 2 parts (lbarc, lbare, mbarc, mbare, rbarc or mbare)
        if (i == 131 || i == 133 || i == 139 || i == 141 || i == 147 || i == 149) {
          segments[i].childNodes[1].style.fillOpacity = 0.1; // first part of segment
          segments[i].childNodes[3].style.fillOpacity = 0.1; // second part of segment
        }
        // If selected segment have one part (rest of segments)
        else
          segments[i].style.fillOpacity = 0.1;
      }
      // If segment is off, turn it on - check it in data transfer array
      else {
        // Turning segment on - data transfer array
        data_array.setBit(i + 1, 1);
        // Turning segment on - style
        // If selected segment have 2 parts (lbarc, lbare, mbarc, mbare, rbarc or mbare)
        if (i == 131 || i == 133 || i == 139 || i == 141 || i == 147 || i == 149) {
          segments[i].childNodes[1].style.fillOpacity = 0.8; // first part of segment
          segments[i].childNodes[3].style.fillOpacity = 0.8; // second part of segment
        }
        // If selected segment have one part (rest of segments)
        else
          segments[i].style.fillOpacity = 0.8;
      }
      console.log(data_array.data);
      // Forward transfer data to node server
      socket.emit("transfer_data", data_array.data);
    });
  }
});
