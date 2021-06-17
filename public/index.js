$(document).ready(()=>{
    const socket = io.connect();

    let currentUser;

    $('#create-user-btn').click((e) => {
      e.preventDefault();

      let username = $('#username-input').val();
      if(username.length > 0){
        //Emit to the server the new user
        socket.emit('new user', username);
        currentUser = username;
        $('.username-form').remove();
        $('.main-container').css('display', 'flex');
      }
    });

    $('#send-chat-btn').click((e) => {
        e.preventDefault();
        // get the message text value
        let message = $('#chat-input').val();
        // make sure message is not empty
        if(message.length > 0) {
            // emit the message with the current user to the server
            socket.emit('new message', {
                sender: currentUser,
                message: message
            });
            $('#chat-input').val("");
        }
    });

      // Listen for "new user" socket emits
      socket.on('new user', (username) => {
        console.log(`${username} has joined the chat!`);
        // Add the new user to the online user div
        $('.users-online').append(`<div class="user-online">${username}</div>`);
    });

    //Output the new message
    socket.on('new message', (data) => {
        $('.message-container').append(`
        <div class="message">
            <p class="message-user">${data.sender}: </p>
            <p class="message-text">${data.message}</p>
        </div>
        `);
    });

});