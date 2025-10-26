const ws = new WebSocket("ws://localhost:3000");
const log = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  document.getElementById("messages").appendChild(div);
};

ws.onopen = () => log("✅ Connected");
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === "new message") log("💬 " + data);
};
ws.onclose = () => log("🔴 Disconnected");

document.getElementById("send").onclick = () => {
  const msg = document.getElementById("msg").value;
  ws.send(JSON.stringify({ type: "send message", data: msg }));
  log("🧑 You: " + msg);
  document.getElementById("msg").value = "";
};
