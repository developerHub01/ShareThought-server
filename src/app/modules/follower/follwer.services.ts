import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { FollowerModel } from "./follower.model";

const getChannelFollowing = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  try {
    const followerQuery = new QueryBuilder(
      FollowerModel.find({
        userId,
      }).populate({
        path: "channelId",
        select: "channelName channelAvatar",
      }),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await followerQuery.countTotal();
    const result = await followerQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const getChannelFollowers = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  try {
    const followerQuery = new QueryBuilder(
      FollowerModel.find({
        channelId,
      }).populate({
        path: "userId",
        select: "fullName avatar",
      }),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await followerQuery.countTotal();
    const result = await followerQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const handleChannelFollowToggle = async (channelId: string, userId: string) => {
  return await FollowerModel.followToggle(channelId, userId);
};

export const FollowerServices = {
  getChannelFollowing,
  getChannelFollowers,
  handleChannelFollowToggle,
};
