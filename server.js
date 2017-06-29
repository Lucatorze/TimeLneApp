const path = require('path');
const dateTime = require('node-datetime');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) ); 
app.use( express.static(path.join(__dirname, 'public')) );

let postList = [];

io.on('connection', socket => {
    const currentUser = {
        id     : null,
        pseudo : null
    };
    
    const post = {
        pseudo : null,
        date   : null,
        img    : null,
        text   : null
    };
    
    socket.on('setConnexion', pseudo => {
        currentUser.id     = socket.id;
        currentUser.pseudo = pseudo;
        
        socket.emit('postList', postList);
    });
    
    
    socket.on('message', (data) => {
        var dt = dateTime.create();
        var formatted = dt.format('d/m/Y');
        
        post.pseudo = currentUser.pseudo;
        post.date   = formatted;
        post.img    = data.img;
        post.text   = data.text;
        
        postList.push(post);
        
        console.log(postList);
        
        socket.broadcast.emit('message', {
            pseudo : currentUser.pseudo,
            date : formatted,
            img : data.img,
            text : data.text
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', currentUser);
    });

});

const port = process.env.PORT || 50666;
server.listen(port, () => console.log(`Mon serveur fonctionne sur http://localhost:${port}`));


