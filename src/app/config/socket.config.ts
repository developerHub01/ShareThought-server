import { Server } from "socket.io";
import http from "http";
import { registerSocketHandler } from "../socket";

const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        // "http://localhost:3000"
      ], // Adjust based on your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // eslint-disable-next-line no-console
    console.log("A user connected");

    registerSocketHandler(socket, io);

    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log("A user disconnected");
    });
  });

  return io;
};

export default initSocket;
