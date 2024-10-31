import { redis } from "../../config/redis.config";
import { TDocumentType } from "../../interface/interface";
import { RedisKeys } from "../../redis.keys";
import { ChannelConstant } from "./channel.constant";
import { IChannel, ICreateChannel } from "./channel.interface";
import { ChannelServices } from "./channel.services";

const singleChannel = async ({
  channelId,
  isAuthor,
}: {
  channelId: string;
  isAuthor: boolean;
}) => {
  const channelKey = RedisKeys.channelKey(channelId);

  const channelData = await redis.get(channelKey);

  if (channelData) return JSON.parse(channelData);

  const result = await ChannelServices.singleChannel({
    id: channelId,
    author: isAuthor,
  });

  await redis.setex(
    channelKey,
    ChannelConstant.POST_REDIS_TTL,
    JSON.stringify(result),
  );

  return result;
};

const createChannel = async ({ payload }: { payload: ICreateChannel }) => {
  const result = (await ChannelServices.createChannel({
    payload,
  })) as TDocumentType<IChannel>;

  if (!result) return result;

  const { _id } = result;

  const channelKey = RedisKeys.channelKey(_id?.toString());

  await redis.setex(
    channelKey,
    ChannelConstant.POST_REDIS_TTL,
    JSON.stringify(result),
  );

  return result;
};

const updateChannel = async ({
  channelId,
  payload,
}: {
  channelId: string;
  payload: Partial<IChannel>;
}) => {
  const channelKey = RedisKeys.channelKey(channelId);

  const result = (await ChannelServices.updateChannel({
    id: channelId,
    payload,
  })) as TDocumentType<IChannel>;

  if (!result) return result;

  await redis.setex(
    channelKey,
    ChannelConstant.POST_REDIS_TTL,
    JSON.stringify(result),
  );

  return result;
};

const deleteChannel = async ({ channelId }: { channelId: string }) => {
  const channelKey = RedisKeys.channelKey(channelId);

  const result = ChannelServices.deleteChannel({ id: channelId });

  if (!result) return result;

  await redis.del(channelKey);

  return result;
};

const channelModeratorCount = async ({ channelId }: { channelId: string }) => {
  const moderatorsCountKey = RedisKeys.channelModeratorsCount(channelId);

  const moderatorsCount = await redis.get(moderatorsCountKey);

  if (moderatorsCount) return JSON.parse(moderatorsCount);

  const result = await ChannelServices.channelModeratorCount({ channelId });

  await redis.setex(
    moderatorsCountKey,
    ChannelConstant.CHANNEL_MODERATOR_COUNT_TTL,
    JSON.stringify(result),
  );

  return result;
};

export const ChannelCache = {
  singleChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  channelModeratorCount,
};
