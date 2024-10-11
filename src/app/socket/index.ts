import { Server, Socket } from "socket.io";
import registerFollowerSocketHandlers from "../modules/follower/follower.socket";

export const registerSocketHandler = (socket: Socket, io: Server) => {
  registerFollowerSocketHandlers(socket, io);
};
