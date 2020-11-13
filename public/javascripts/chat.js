var socket = io.connect();

socket.on('connect', () => {
    console.log('connect');
});

var form = document.getElementById('form');
var list = document.getElementById('list');
var input = form.elements[0];

form.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('message', { message: input.value });
    form.reset();
});

socket.on('join', function({ username }) {
    printMessage(`${username} is here`);
});

socket.on('leave', function({ username }) {
    printMessage(`${username} is out`);
});

socket.on('push', function({ username, message, owner }) {
    var message = owner ? message : `${username}: ${message}`;
    printMessage(message, owner);
});

function printMessage(message, owner) {
    var li = document.createElement('li');
    li.classList.add('list-group-item');
    li.classList.add(owner ? 'owner': 'partner');
    li.textContent = message;
    list.appendChild(li);
}