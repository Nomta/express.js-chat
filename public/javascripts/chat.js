const socket = io.connect();

socket.on("connect", () => {
    console.log("connect");
});

const form = document.getElementById("form");
const list = document.getElementById("list");
const input = form.elements[0];

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (input.value) {
        socket.emit("message", { message: input.value });
        form.reset();
    }
});

socket.on("join", function ({ username }) {
    printMessage(`${username} is here`);
});

socket.on("leave", function ({ username }) {
    printMessage(`${username} is out`);
});

socket.on("push", function ({ username, message, owner }) {
    message = owner ? message : `${username}: ${message}`;
    printMessage(message, owner);
});

function printMessage(message, owner) {
    const li = document.createElement("li");

    li.classList.add("list-group-item");
    li.classList.add(owner ? "owner" : "partner");
    li.textContent = message;
    list.appendChild(li);
}
