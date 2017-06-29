const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) ); 
app.use( express.static(path.join(__dirname, 'public')) );

io.on('connection', socket => {
    let messageArray = {};
    const currentUser = {
        id     : null,
        pseudo : null
    };
    
    socket.on('setPseudo', pseudo => {
        currentUser.id     = socket.id;
        currentUser.pseudo = pseudo;
    });

    socket.on('message', (data) => {
        messageArray.push( {
            pseudo : currentUser.pseudo,
            img : data.img,
            text : data.messageText
        });
        socket.broadcast.emit('message', messageArray);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', currentUser);
    });

});

const port = process.env.PORT || 50666;
server.listen(port, () => console.log(`le serveur écoute sur le port ${port}`));


