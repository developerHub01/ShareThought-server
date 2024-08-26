import mongoose from "mongoose";
import { ChannelModel } from "./model";
import channelSchema from "./model.schema";
import { PostModel } from "../../post/model/model";
import AppError from "../../../errors/AppError";
import httpStatus from "http-status";
import errorHandler from "../../../errors/errorHandler";
import { IChannel, ICreateChannel } from "../channel.interface";
import { TDocumentType } from "../../../interface/interface";

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
  try {
    const { channelName, authorId } = payload;

    if (await ChannelModel.find({ channelName, authorId }))
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You already have a channel with that name",
      );

    return await ChannelModel.create({
      ...payload,
    });
  } catch (error) {
    errorHandler(error);
  }
};

// update channel
channelSchema.statics.updateChannel = async (
  id: string,
  payload: Partial<IChannel>,
) => {
  try {
    const { channelName } = payload;

    const channelData = (await ChannelModel.findById(
      id,
    )) as TDocumentType<IChannel>;

    if (!channelData)
      throw new AppError(httpStatus.NOT_FOUND, "Channel not found");

    const { authorId } = channelData;

    if (
      await ChannelModel.find({
        channelName,
        authorId,
        _id: {
          $ne: id,
        },
      })
    )
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You already have a channel with that name",
      );

    return await ChannelModel.findByIdAndUpdate(
      id,
      {
        ...payload,
      },
      { new: true },
    );
  } catch (error) {
    errorHandler(error);
  }
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
    errorHandler(error);
  }
};
