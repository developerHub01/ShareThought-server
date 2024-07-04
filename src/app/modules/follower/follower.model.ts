import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import errorHandler from "../../errors/errorHandler";
import { IFollower, IFollowerModel } from "./follower.interface";
import { Schema, model } from "mongoose";

const followerSchema = new Schema<IFollower, IFollowerModel>({
  channelId: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

followerSchema.pre("save", async function (next) {
  try {
    const result = await FollowerModel.findOne({
      channelId: this.channelId,
      userId: this.userId,
    });

    if (!result) return next();

    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Already following");
  } catch (error) {
    errorHandler(error);
  }
});

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

export const FollowerModel = model<IFollower, IFollowerModel>(
  "follower",
  followerSchema,
);
