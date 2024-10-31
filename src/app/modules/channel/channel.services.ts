import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ModeratorModel } from "../moderator/model/model";
import { IModeratorPopulated } from "../moderator/moderator.interface";
import { ChannelConstant } from "./channel.constant";
import { IChannel, ICreateChannel } from "./channel.interface";
import { ChannelModel } from "./model/model";
import { TDocumentType } from "../../interface/interface";
import mongoose from "mongoose";
import { PostModel } from "../post/model/model";

const singleChannel = async ({
  id,
  author,
}: {
  id: string;
  author: boolean;
}) => {
  if (author)
    return await ChannelModel.findById(id).populate({
      path: "authorId",
      select: "fullName avatar",
    });

  return await ChannelModel.findById(id);
};

// get all channel or filter and search channel
const findChannel = async ({ query }: { query: Record<string, unknown> }) => {
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

const getChannelOfMine = async ({
  query,
  authorId,
}: {
  query: Record<string, unknown>;
  authorId: string;
}) => {
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

const getMyModeratedChannel = async ({
  query,
  userId,
}: {
  query: Record<string, unknown>;
  userId: string;
}) => {
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

const createChannel = async ({ payload }: { payload: ICreateChannel }) => {
  const { channelName, authorId } = payload;

  if (await ChannelModel.findOne({ channelName, authorId }))
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a channel with that name",
    );

  return await ChannelModel.create({
    ...payload,
  });
};

const updateChannel = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<IChannel>;
}) => {
  // Destructure the channel name from the payload
  const { channelName } = payload;

  // Fetch the channel data by ID
  const channelData = (await ChannelModel.findById(
    id,
  )) as TDocumentType<IChannel>;

  // If the channel is not found, throw a 'Not Found' error
  if (!channelData)
    throw new AppError(httpStatus.NOT_FOUND, "Channel not found");

  // Extract the authorId from the channel data
  const { authorId } = channelData;

  // Check if there are any other channels with the same name by the same author, excluding the current channel
  const matchedNamedChannels = await ChannelModel.find({
    channelName,
    authorId,
    _id: {
      $ne: id, // Exclude the current channel ID
    },
  });

  // If a channel with the same name already exists, throw a 'Bad Request' error
  if (Array.isArray(matchedNamedChannels) && matchedNamedChannels.length)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a channel with that name",
    );

  // If no duplicate channels are found, update the channel with the provided payload and return the updated document
  return await ChannelModel.findByIdAndUpdate(
    id,
    {
      ...payload,
    },
    { new: true }, // Return the updated document
  );
};

const deleteChannel = async ({ id }: { id: string }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await PostModel.deleteMany({ channelId: id }, { session });

    const result = await ChannelModel.findByIdAndDelete(id, {
      session,
    });

    await session.commitTransaction();
    await session.endSession();

    if (!result)
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong",
      );

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const channelModeratorCount = async ({ channelId }: { channelId: string }) => {
  const channelData = await ChannelModel.findById(channelId).select(
    "moderatorCount moderatorPendingCount authorId",
  );

  if (!channelData)
    throw new AppError(httpStatus.NOT_FOUND, "channel not found");

  return {
    moderatorCount: channelData.moderatorCount,
    moderatorPendingCount: channelData.moderatorPendingCount,
  };
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
