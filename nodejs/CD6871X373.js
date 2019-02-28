/*
  Web Application for controlling CD6871X373.js
  Description:
    Receives transfer data array from client interface, converts it to 
    char array and sends it to arduino via serial port
    WebSocket is used for communication with client interface
  Author: Dejan Cvijetinovic
  Date: 25.02.2019
*/

// Create http server
// Require http server, and create server with function handler()
var http = require('http').createServer(handler); // Require http server
var fs = require('fs'); // require filesystem module
var path = require('path');
const SerialPort = require('serialport');
// Require socket.io module and pass the http object (server)
var io = require('socket.io')(http);

http.listen(8080); // listen to port 8080

function handler(req, res) { // create server
  if (req.url === '/') {
    // read file index.html in public folder
    fs.readFile(__dirname + '/public/index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'}); // write HTML
      res.write(data); // write data from index.html
      return res.end();
    });
  }
  else if (req.url.match("\.css$")) {
    var cssPath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, {'Content-Type' : 'text/css'});
    fileStream.pipe(res);
  }
  else if (req.url.match("\.js$")) {
    var jsPath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(jsPath);
    res.writeHead(200, {'Content-Type' : 'text/js'});
    fileStream.pipe(res);
  }
  else {
    // Display 404 on error
    res.writeHead(404, {'Content-Type' : 'text/html'});
    return res.end('404 Not Found');
  }
}

// Open serial port
const port = new SerialPort('COM3');
/*
port.write('main screen turn on', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
  console.log('message written')
})

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})
*/

//setTimeout(() => port.write('s'), 2000);

// Open WebSocket
io.sockets.on('connection', function(socket) { // WebSocket Connection
  socket.on('transfer_data', function(data) { // get transfer data array from client
    console.log(data);
    // Send data to device
    // Convert data transfer array from numbers to buffer chars
    var buf = new Buffer(data);
    port.write('d'); // send command for data transfer to Arduino
    port.write(buf); // send data transfer array to Arduino
  });
});
/*
port.on('readable', function() {
  console.log(port.read());
});
*/