// App.js
const express = require('express');
const app = express();
// Socket.io has to use the http server
const server = require('http').Server(app);

// Socket.io implementation
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    // this is read on any new socket connection
    require('./sockets/chat.js')(io, socket);
});

// Express View Engine for Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('index.handlebars');
});

server.listen('3030', () => {
    console.log('Server is listening on Port 3030');
});