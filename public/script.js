const userEl = document.getElementById("user");
const testEl = document.getElementById("text");
const chatBoxEl = document.getElementById("chat-box");

const socket = new WebSocket("ws://localhost:3000");

// socket.onopen = (event) => {
//   console.log(event);
// };

socket.onmessage = (event) => {
  console.log(event.data);
};

socket.onopen = () => {
  socket.send("message from client to server");
};
      