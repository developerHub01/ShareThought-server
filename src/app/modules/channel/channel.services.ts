import QueryBuilder from "../../builder/QueryBuilder";
import { ModeratorModel } from "../moderator/model/model";
import { IModeratorPopulated } from "../moderator/moderator.interface";
import { ChannelConstant } from "./channel.constant";
import { IChannel, ICreateChannel } from "./channel.interface";
import { ChannelModel } from "./model/model";

const singleChannel = async (id: string, author: boolean) => {
  if (author)
    return await ChannelModel.findById(id).populate({
      path: "authorId",
      select: "fullName avatar",
    });

  return await ChannelModel.findById(id);
};

// get all channel or filter and search channel
const findChannel = async (query: Record<string, unknown>) => {
  const chennelQuery = new QueryBuilder(
    ChannelModel.find({}).populate({
      path: "authorId",
      select: "fullName avatar",
    }),
    query,
  )
    .search(ChannelConstant.CHANNEL_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await chennelQuery.countTotal();
  const result = await chennelQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getChannelOfMine = async (
  query: Record<string, unknown>,
  authorId: string,
) => {
  const chennelQuery = new QueryBuilder(
    ChannelModel.find({
      authorId,
    }),
    query,
  )
    .search(ChannelConstant.CHANNEL_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await chennelQuery.countTotal();
  const result = await chennelQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getMyModeratedChannel = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const chennelQuery = new QueryBuilder(
    ModeratorModel.find({
      userId,
    })
      .select({
        channelId: true,
        "permissions.moderator": true,
      })
      .populate({
        path: "channelId",
      })
      .lean(),
    query,
  )
    .search(ChannelConstant.CHANNEL_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await chennelQuery.countTotal();
  const channelsData =
    (await chennelQuery.modelQuery) as unknown as Array<IModeratorPopulated>;

  const result = channelsData.map((data) => ({
    ...data.channelId,
    role:
      data.permissions.moderator?.add || data.permissions.moderator?.canRemove
        ? ChannelConstant.CHANNEL_USER_ROLES.SUPER_MODERATOR
        : ChannelConstant.CHANNEL_USER_ROLES.NORMAL_MODERATOR,
  }));

  return {
    meta,
    result,
  };
};

const createChannel = async (payload: ICreateChannel) => {
  return ChannelModel.createChannel(payload);
};

const updateChannel = async (id: string, payload: Partial<IChannel>) => {
  return ChannelModel.updateChannel(id, payload);
};

const deleteChannel = async (id: string) => {
  return ChannelModel.deleteChannel(id);
};

const channelModeratorCount = async (channelId: string) => {
  return ChannelModel.channelModeratorCount(channelId);
};

export const ChannelServices = {
  findChannel,
  singleChannel,
  getChannelOfMine,
  getMyModeratedChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  channelModeratorCount,
};
