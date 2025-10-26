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

const clients = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  console.log("new clinet connected");

  ws.on("message", async (msg, isBinary) => {
    const { type, data } = await JSON.parse(msg);

    if (type === "set_name") {
      ws.name = data.name;
      clients.set(data.name, ws);
      // console.log(clients);

      console.log(`client registred as ${data.name}`);
    }

    if (type === "send_message") {
      const { to, message } = data;
      console.log({ to, message });

      const target = clients.get(to);
      // console.log({target});
      console.log(target.readState,WebSocket.OPEN);
      

      if (target && target.readyState === WebSocket.OPEN) {
        target.send(
          JSON.stringify({
            type: "receive_message",
            data: { from: ws.name, message },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: "error",
            data: `user ${to} not found ot dc`,
          })
        );
      }
    }
  });

  ws.on("close", () => {
    if (ws.name) {
      clients.delete(ws.name);
      console.log(`${ws.name}🔴 Client disconnected`);
    } else console.log(`unknown client dc`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
