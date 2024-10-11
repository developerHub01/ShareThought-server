import { Server, Socket } from "socket.io";
import { FollowerCache } from "./follower.cache";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerFollowerSocketHandlers = (socket: Socket, io: Server) => {
  socket.on("get_followers_count", async ({ channelId }) => {
    const followersCount =
      await FollowerCache.getChannelFollowersCount(channelId);

    socket.emit(`followers_count_${channelId}`, followersCount);
  });
};

export default registerFollowerSocketHandlers;
