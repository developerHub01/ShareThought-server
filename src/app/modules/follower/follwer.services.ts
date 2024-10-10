import QueryBuilder from "../../builder/QueryBuilder";
import { FollowerModel } from "./model/model";

const getChannelFollowing = async (
  query: Record<string, unknown>,
  userId: string,
) => {
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
};

const getChannelFollowers = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
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
};

const getChannelFollowersCount = async (channelId: string) => {
  return await FollowerModel.getChannelFollowersCount(channelId);
};

const handleChannelFollowToggle = async (channelId: string, userId: string) => {
  return await FollowerModel.followToggle(channelId, userId);
};

export const FollowerServices = {
  getChannelFollowing,
  getChannelFollowers,
  getChannelFollowersCount,
  handleChannelFollowToggle,
};
