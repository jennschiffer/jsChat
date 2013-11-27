var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function (socket) {
    
  socket.on('send', function (data) { 
    var messages = [];
  	io.sockets.emit('message',data); 
  });
  
  socket.on('disconnect', function () { });
  
});
