import { FollowerServices } from "./follwer.services";
import { Server, Socket } from "socket.io";
import { FollowerCache } from "./follower.cache";
import { ISocketGetFollowersQuery } from "./follower.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerFollowerSocketHandlers = (socket: Socket, io: Server) => {
  socket.on("get_followers_count", async ({ channelId }) => {
    const followersCount =
      await FollowerCache.getChannelFollowersCount(channelId);

    socket.emit(`followers_count_${channelId}`, followersCount);
  });

  socket.on("get_followers_list", async (query: ISocketGetFollowersQuery) => {
    const { channelId } = query;
    socket.emit(
      `followers_list_${channelId}`,
      await FollowerServices.socketGetFollowers(query),
    );
  });
};

export default registerFollowerSocketHandlers;
