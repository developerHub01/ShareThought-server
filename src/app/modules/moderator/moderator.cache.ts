import { redis } from "../../config/redis.config";
import { RedisKeys } from "../../redis.keys";
import { ChannelConstant } from "../channel/channel.constant";
import { ChannelModel } from "../channel/model/model";
import { IModeratorPayload } from "./moderator.interface";
import { ModeratorServices } from "./moderator.services";

const addModerator = async (channelId: string, payload: IModeratorPayload) => {
  const { moderatorData: result, isRequesting } =
    await ModeratorServices.addModerator(channelId, payload);

  if (!result) return result;

  const moderatorsCountKey = RedisKeys.channelModeratorsCount(channelId);

  const cachedJSON = await redis.get(moderatorsCountKey);

  let cachedData = cachedJSON && JSON.parse(cachedJSON);

  if (!cachedData)
    cachedData = await ChannelModel.channelModeratorCount(channelId);
  else if (!isRequesting)
    cachedData = {
      ...cachedData,
      moderatorPendingCount: cachedData.moderatorPendingCount + 1,
    };

  await redis.setex(
    moderatorsCountKey,
    ChannelConstant.CHANNEL_MODERATOR_COUNT_TTL,
    JSON.stringify(cachedData),
  );

  return result;
};

const acceptModerationRequest = async (userId: string, moderatorId: string) => {
  const result = await ModeratorServices.acceptModerationRequest(
    userId,
    moderatorId,
  );

  if (!result) return result;

  const channelId = result?.channelId?.toString();

  /* getting redis key for channel moderators count */
  const moderatorsCountKey = RedisKeys.channelModeratorsCount(channelId);

  const cachedJSON = await redis.get(moderatorsCountKey);

  let cachedData = cachedJSON && JSON.parse(cachedJSON);

  if (!cachedData)
    cachedData = await ChannelModel.channelModeratorCount(channelId);
  else
    cachedData = {
      moderatorPendingCount: cachedData.moderatorPendingCount - 1,
      moderatorCount: cachedData.moderatorCount + 1,
    };

  await redis.setex(
    moderatorsCountKey,
    ChannelConstant.CHANNEL_MODERATOR_COUNT_TTL,
    JSON.stringify(cachedData),
  );

  return result;
};

const resign = async (userId: string, moderatorId: string) => {
  const result = await ModeratorServices.resign(userId, moderatorId);

  if (!result) return result;

  const channelId = result?._id?.toString();

  /* getting redis key for channel moderators count */
  const moderatorsCountKey = RedisKeys.channelModeratorsCount(channelId);

  const cachedJSON = await redis.get(moderatorsCountKey);

  let cachedData = cachedJSON && JSON.parse(cachedJSON);

  if (!cachedData)
    cachedData = await ChannelModel.channelModeratorCount(channelId);
  else
    cachedData = {
      ...cachedData,
      moderatorCount: cachedData.moderatorCount - 1,
    };

  await redis.setex(
    moderatorsCountKey,
    ChannelConstant.CHANNEL_MODERATOR_COUNT_TTL,
    JSON.stringify(cachedData),
  );

  return result;
};

export const ModeratorCache = {
  addModerator,
  acceptModerationRequest,
  resign,
};
