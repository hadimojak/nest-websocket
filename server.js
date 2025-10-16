import http from "http";
import path from "path";
import cors from "cors";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const PORT = 3000;

const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  console.log("client connected");

  ws.send("message from server to client");

  ws.on("message", (data, isBinary) => {
    const msg = isBinary ? data : data.toString();
    console.log(msg);
  });
});

wss.on("error", console.error);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
