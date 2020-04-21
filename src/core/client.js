// import listener from './listener'
// import Message from './message'
import io from 'socket.io-client';

var socket;

function init(url){
    socket = io(url);
}

function send(type, data){
    socket.emit(type, data);
}

function on(type, callback){
    socket.on(type, callback);
}

/*
listener.on('init', (url)=>{
    socket = io(url);

    socket.on('connect', ()=>{
        console.log('socket connect');
        listener.emit('connect');
    });
    
    socket.on('disconnect', ()=>{
        console.log('socket disconnect');

        listener.emit('disconnect');
    });

    socket.on(Message.TYPE_MESSAGE, (data)=>{
        console.log('socket ' + Message.TYPE_MESSAGE);
        console.log(data);

        var obj = JSON.parse(data);
        listener.emit(Message.TYPE_MESSAGE, obj.data);
    });
})

listener.on('send', obj=>{
    console.log('send ' + obj.type);
    console.log(obj);
    socket.emit(obj.type, obj);
})
*/

export default {
    init,
    send,
    on
}