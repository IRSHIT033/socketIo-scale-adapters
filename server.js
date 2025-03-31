import { Redis } from "ioredis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = new Redis({ host: "redis", port: 6379 });
const subClient = pubClient.duplicate();

const io = new Server({
  adapter: createAdapter(pubClient, subClient),
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for messages from clients
  socket.on("message", (data) => {
    console.log(`Message received: ${data}`);
    // Broadcast the message to all clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

io.listen(3000);
