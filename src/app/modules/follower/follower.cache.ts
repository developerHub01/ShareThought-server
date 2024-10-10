import { redis } from "../../config/redis.config";
import { RedisKeys } from "../../redis.keys";
import { FollowerConstant } from "./follower.constant";
import { IFollowerCount } from "./follower.interface";
import { FollowerServices } from "./follwer.services";
import { FollowerModel } from "./model/model";

const getChannelFollowersCount = async (channelId: string) => {
  const followersCountkey = RedisKeys.channelFollowersCount(channelId);

  let followerCount = await redis.get(followersCountkey);

  if (followerCount) {
    followerCount = JSON.parse(followerCount);

    const { count } = followerCount as unknown as IFollowerCount;

    if (count === undefined || count === null) return null;

    return followerCount;
  }

  const result = await FollowerServices.getChannelFollowersCount(channelId);

  if (!result) return result;

  await redis.setex(
    followersCountkey,
    FollowerConstant.FOLLOWERS_COUNT_TTL,
    JSON.stringify(result),
  );

  return result;
};

const handleChannelFollowToggle = async (channelId: string, userId: string) => {
  const followersCountkey = RedisKeys.channelFollowersCount(channelId);

  const result = await FollowerServices.handleChannelFollowToggle(
    channelId,
    userId,
  );

  if (!result) return result;

  const channelFollowerCount =
    await FollowerModel.getChannelFollowersCount(channelId);

  if (!channelFollowerCount) return result;

  await redis.setex(
    followersCountkey,
    FollowerConstant.FOLLOWERS_COUNT_TTL,
    JSON.stringify(channelFollowerCount),
  );

  return result;
};

export const FollowerCache = {
  getChannelFollowersCount,
  handleChannelFollowToggle,
};
