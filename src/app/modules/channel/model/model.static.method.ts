import mongoose from "mongoose";
import channelSchema from "./model.schema";
import { PostModel } from "../../post/model/model";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
import {
  IChannel,
  ICreateChannel,
  IChannelModeratorCount,
} from "../channel.interface";
import { TDocumentType } from "../../../interface/interface";
import { ChannelModel } from "./model";

// is channel exist
channelSchema.statics.isChannelExist = async (id: string) => {
  return Boolean(await ChannelModel.findById(id));
};

// is that my channel or not
channelSchema.statics.isChannelMine = async (
  channelId: string,
  authorId: string,
) => {
  return Boolean(
    await ChannelModel.findOne({
      _id: channelId,
      authorId,
    }),
  );
};

// create channel
channelSchema.statics.createChannel = async (payload: ICreateChannel) => {
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

/**
 * Updates a channel by its ID with the provided payload.
 *
 * @param {string} id - The ID of the channel to update.
 * @param {Partial<IChannel>} payload - The partial payload containing fields to be updated in the channel.
 * @returns {Promise<TDocumentType<IChannel> | null | void>} - Returns the updated channel document or void if an error occurs.
 */
channelSchema.statics.updateChannel = async (
  id: string,
  payload: Partial<IChannel>,
): Promise<TDocumentType<IChannel> | null | void> => {
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

// deleting channel
channelSchema.statics.deleteChannel = async (id: string) => {
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

channelSchema.statics.channelModeratorCount = async (
  channelId: string,
): Promise<IChannelModeratorCount> => {
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
