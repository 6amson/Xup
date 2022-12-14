import { io } from "socket.io-client";


const joinRoomButton = document.getElementById('room-button');
const messageInput = document.getElementById('message-input');
const roomInput = document.getElementById('room-input');
const form = document.getElementById('form');

const socket = io('http://localhost:3000');

const name = prompt('whats your name').trim();
displayMessage(`you joined`);

const room = roomInput.value;
socket.emit('newUser', room, name);

socket.on('userConnected', name => {
    displayMessage(`${name} connected`)
});

//socket.on('connect', () => {
//    displayMessage(`${name} connected with id: ${socket.id}`)
//});


socket.on('receiveMessage', data => {
    displayMessage(`${data.name}: ${data.message}`)
})


form.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomInput.value;

    if(message === "") return;
    displayMessage(`You: ${message}`);
    
    socket.emit('sendMessage', message, room);

    messageInput.value = '';
})

joinRoomButton.addEventListener('click', () => {
    const room = roomInput.value;
    socket.emit('joinRoom', room, name, message =>{
        displayMessage(message);
       
    })
})

function displayMessage(message){
    const div = document.createElement('div');
    div.textContent = message;
    document.getElementById('message-container').append(div)
    div.style.fontSize = "20px";
    div.style.background = '#E5E4E2';
    div.style.marginTop = '5px';
    //div.style.width = 100%;
}