import httpStatus from "http-status";
import { FollowerModel } from "./model";
import followerSchema from "./model.schema";
import { ChannelModel } from "../../channel/model/model";
import AppError from "../../../errors/AppError";

followerSchema.statics.isFollowing = async (
  channelId: string,
  userId: string,
) => {
  return Boolean(
    await FollowerModel.findOne({
      channelId,
      userId,
    }),
  );
};

followerSchema.statics.followToggle = async (
  channelId: string,
  userId: string,
) => {
  const isMyChannel = await ChannelModel.isChannelMine(channelId, userId);

  if (isMyChannel)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't follow your own channel",
    );

  const isFollowing = await FollowerModel.isFollowing(channelId, userId);
  if (isFollowing) {
    return await FollowerModel.deleteOne({
      userId,
      channelId,
    });
  }

  return await FollowerModel.create({
    userId,
    channelId,
  });
};
