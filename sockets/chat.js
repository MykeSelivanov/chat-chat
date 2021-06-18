module.exports = (io, socket, onlineUsers, channels) => {

    // Listen for "new user" socket emits
    socket.on('new user', (username) => {
        // Save the username as key to access the user's socket id
        onlineUsers[username] = socket.id;
        // Saving the username to socket
        socket['username'] = username;

        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit('new user', username);
    });

     //Listen for new messages
    socket.on('new message', (data) => {
        // Send that data back to ALL clients
        channels[data.channel].push({sender: data.sender, message: data.message});
        io.to(data.channel).emit('new message', data);
    });

    socket.on('get online users', () => {
        socket.emit('get online users', onlineUsers);
    });

    socket.on('disconnect', () => {
        delete onlineUsers[socket.username];
        io.emit('user has left', onlineUsers);
    });

    socket.on('new channel', (newChannel) => {
        // start new channel
        channels[newChannel] = [];

        // share info with socket
        socket.join(newChannel);
        // inform all 
        io.emit('new channel', newChannel);

        // share data to client
        socket.emit('user changed channel', {
            channel: newChannel,
            messages: channels[newChannel]
        });
    });

    socket.on('user changed channel', (newChannel) => {
        socket.join(newChannel);

        // share date to client
        socket.emit('user changed channel', {
            channel: newChannel,
            messages: channels[newChannel]
        });
        console.log('server saw chanel')
    })

}