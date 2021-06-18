$(document).ready(()=>{
    const socket = io.connect();

    let currentUser;
    // Get the online users from the server
    socket.emit('get online users');
    socket.emit('user changed channel', 'General');

    // changing channels by click
    $(document).on('click', '.channel', (e) => {
        let newChannel = e.target.textContent;
        socket.emit('user changed channel', newChannel);
    });

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
        // get current channel name
        let channel = $('.channel-current').text();
        // get the message text value
        let message = $('#chat-input').val();
        // make sure message is not empty
        if(message.length > 0) {
            // emit the message with the current user to the server
            socket.emit('new message', {
                sender: currentUser,
                message: message,
                channel: channel
            });
            $('#chat-input').val("");
        }
    });

    $('#new-channel-btn').click(() => {
        let newChannel = $('#new-channel-input').val();

        if (newChannel.length > 0) {
            // share new channel with the server
            socket.emit('new channel', newChannel);
            $('#new-channel-input').val("");
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
        let currentChannel = $('.channel-current').text();
        // only append the message if the curent user is currently in that channel
        if(currentChannel == data.channel) {
            $('.message-container').append(`
            <div class="message">
                <p class="message-user">${data.sender}: </p>
                <p class="message-text">${data.message}</p>
            </div>
            `);
        }
    });

    socket.on('get online users', (onlineUsers) => {
        for (username in onlineUsers) {
            $('.users-online').append(`<div class="user-online">${username}</div>`);
        }
    });

    socket.on('user has left', (onlineUsers) => {
        $('.users-online').empty();
        for (username in onlineUsers) {
            $('.users-online').append(`<div class="user-online">${username}</div>`);
        }
    });

    socket.on('user changed channel', (data) => {
        $('.channel-current').addClass('channel');
        $('.channel-current').removeClass('channel-current');
        $(`.channel:contains('${data.channel}')`).addClass('channel-current');
        $('.channel-current').removeClass('channel');
        $('.message').remove();
        data.messages.forEach((message) => {
          $('.message-container').append(`
            <div class="message">
              <p class="message-user">${message.sender}: </p>
              <p class="message-text">${message.message}</p>
            </div>
          `);
        });
    });



});