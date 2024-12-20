import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { IModerator, IModeratorPayload } from "../moderator.interface";
import { ModeratorModel } from "./model";
import moderatorSchema from "./model.schema";
import { ChannelModel } from "../../channel/model/model";
import { TDocumentType } from "../../../interface/interface";
import { IChannel } from "../../channel/channel.interface";
import { ClientSession } from "mongoose";

moderatorSchema.statics.channelModeratorData = async ({
  channelId,
  userId,
}: {
  channelId: string;
  userId: string;
}): Promise<IModerator | null> => {
  return await ModeratorModel.findOne({
    channelId,
    userId,
    isVerified: true,
  });
};

moderatorSchema.statics.getChannelModeratorsCount = async ({
  channelId,
}: {
  channelId: string;
}): Promise<number> => {
  return (await ModeratorModel.countDocuments({ channelId })) || 0;
};

moderatorSchema.statics.addChannelModerator = async ({
  channelId,
  payload,
  session,
}: {
  channelId: string;
  payload: IModeratorPayload;
  session?: ClientSession;
}) => {
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

moderatorSchema.statics.resign = async ({
  userId,
  moderatorId,
  session,
}: {
  userId: string;
  moderatorId: string;
  session?: ClientSession;
}) => {
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

moderatorSchema.statics.isAlreadyModerator = async ({
  channelId,
  userId,
}: {
  channelId: string;
  userId: string;
}): Promise<boolean> => {
  return Boolean(
    await ModeratorModel.findOne({ channelId, userId, isVerified: true }),
  );
};

/**
 *
 * Verifies that a moderator request is accepted by the user.
 * - Ensures the requesting user is indeed the moderator.
 * - Throws an error if the user is not a moderator or already verified.
 *
 */
moderatorSchema.statics.acceptModeratorRequest = async ({
  userId,
  moderatorId,
}: {
  userId: string;
  moderatorId: string;
}): Promise<IModerator> => {
  const moderatorData =
    await ModeratorModel.findById(moderatorId).select("userId isVerified");

  if (!moderatorData)
    throw new AppError(httpStatus.NOT_FOUND, "moderator not found");

  if (moderatorData.isVerified)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "moderator is already verified and accepted",
    );

  if (moderatorData?.userId?.toString() !== userId)
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not that moderator");

  return (await ModeratorModel.findByIdAndUpdate(
    moderatorId,
    { isVerified: true },
    { new: true },
  )) as IModerator;
};
