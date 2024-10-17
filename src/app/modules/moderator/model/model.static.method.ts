import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { IModerator, IModeratorPayload } from "../moderator.interface";
import { ModeratorModel } from "./model";
import moderatorSchema from "./model.schema";
import { ChannelModel } from "../../channel/model/model";
import { TDocumentType } from "../../../interface/interface";
import { IChannel } from "../../channel/channel.interface";
import { ClientSession } from "mongoose";

moderatorSchema.statics.channelModeratorData = async (
  channelId: string,
  userId: string,
): Promise<IModerator | null> => {
  return await ModeratorModel.findOne({
    channelId,
    userId,
    isVerified: true,
  });
};

moderatorSchema.statics.getChannelModeratorsCount = async (
  channelId: string,
): Promise<number> => {
  return (await ModeratorModel.countDocuments({ channelId })) || 0;
};

moderatorSchema.statics.addChannelModerator = async (
  channelId: string,
  payload: IModeratorPayload,
  session?: ClientSession,
) => {
  const { userId, permissions } = payload;

  const channelData = (await ChannelModel.findById(
    channelId,
  )) as TDocumentType<IChannel>;

  if (!channelData)
    throw new AppError(httpStatus.NOT_FOUND, "channel not found");

  const authorId = channelData?.authorId?.toString();

  if (authorId === userId)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "channel author already a super moderator",
    );

  return (
    await ModeratorModel.create(
      [
        {
          channelId,
          userId,
          permissions,
          isVerified: false,
        },
      ],
      session ? { session } : {},
    )
  )[0];
};

moderatorSchema.statics.resign = async (
  userId: string,
  moderatorId: string,
  session?: ClientSession,
) => {
  const moderatorData = (await ModeratorModel.findById(
    moderatorId,
  )) as TDocumentType<IModerator>;
  
  if (!moderatorData)
    throw new AppError(httpStatus.NOT_FOUND, "moderator not found");

  /* if user is not that moderator */
  if (moderatorData.userId?.toString() !== userId || !moderatorData.isVerified)
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not that moderator");

  const deletedModeratorData = await ModeratorModel.findByIdAndDelete(
    moderatorId,
    session ? { session } : {},
  );

  const channelId = moderatorData?.channelId?.toString();

  return deletedModeratorData && channelId
    ? {
        moderatorData: deletedModeratorData,
        channelId,
      }
    : null;
};

moderatorSchema.statics.isAlreadyModerator = async (
  channelId: string,
  userId: string,
): Promise<boolean> => {
  return Boolean(
    await ModeratorModel.findOne({ channelId, userId, isVerified: true }),
  );
};

moderatorSchema.statics.acceptModeratorRequest = async (
  userId: string,
  moderatorId: string,
): Promise<unknown> => {
  const moderatorData =
    await ModeratorModel.findById(moderatorId).select("userId");

  if (!moderatorData)
    throw new AppError(httpStatus.NOT_FOUND, "moderator not found");

  if (moderatorData?.userId?.toString() !== userId)
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not that moderator");

  if (moderatorData.isVerified)
    throw new AppError(httpStatus.FORBIDDEN, "request is already accepted");

  return await ModeratorModel.findByIdAndUpdate(
    moderatorId,
    { isVerified: true },
    { new: true },
  );
};
