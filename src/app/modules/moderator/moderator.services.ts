import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ModeratorModel } from "./model/model";
import {
  IModerator,
  IModeratorPayload,
  IModeratorRequestAcceptanceEmailData,
  IModeratorRequestEmailData,
} from "./moderator.interface";
import { emailQueue } from "../../queues/email/queue";
import { QueueJobList } from "../../queues";
import { TDocumentType } from "../../interface/interface";
import { IChannel } from "../channel/channel.interface";
import { IUser } from "../user/user.interface";

const addModerator = async (channelId: string, payload: IModeratorPayload) => {
  const { userId } = payload;
  if (await ModeratorModel.isAlreadyModerator(channelId, userId))
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "this user is already moderator of your channel",
    );

  const newModerator = (await ModeratorModel.addChannelModerator(
    channelId,
    payload,
  )) as TDocumentType<IModerator>;

  if (!newModerator)
    throw new AppError(httpStatus.FORBIDDEN, "something went wrong");

  const moderatorId = newModerator?._id.toString();

  const moderatorData = await ModeratorModel.findById(moderatorId)
    .populate({
      path: "userId",
      select: "fullName email avatar",
    })
    .populate({
      path: "channelId",
      select: "channelName channelAvatar channelCover",
    });

  const emailDetails: IModeratorRequestEmailData = {
    moderatorId,
    channelCover: (moderatorData?.channelId as unknown as IChannel)
      ?.channelCover,
    channelAvatar: (moderatorData?.channelId as unknown as IChannel)
      ?.channelAvatar,
    channelName: (moderatorData?.channelId as unknown as IChannel)?.channelName,
    moderatorName: (moderatorData?.userId as unknown as IUser)?.fullName,
    moderatorAvatar: (moderatorData?.userId as unknown as IUser)
      ?.avatar as string,
    moderatorEmail: (moderatorData?.userId as unknown as IUser)?.email,
  };

  return await emailQueue.add(
    QueueJobList.SEND_MODERATOR_REQUEST_EMAIL,
    emailDetails,
    {
      removeOnComplete: true,
      removeOnFail: true,
    },
  );
};

const acceptModerationRequest = async (userId: string, moderatorId: string) => {
  const newModerator = (await ModeratorModel.acceptModeratorRequest(
    userId,
    moderatorId,
  )) as TDocumentType<IModerator>;

  if (!newModerator)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "something went wrong. please try again",
    );

  const moderatorData = await ModeratorModel.findById(moderatorId)
    .populate({
      path: "userId",
      select: "fullName email avatar",
    })
    .populate({
      path: "channelId",
      select: "channelName channelAvatar channelCover",
      populate: {
        path: "authorId",
        select: "fullName email",
      },
    });

  const emailDetails: IModeratorRequestAcceptanceEmailData = {
    channelCover: (moderatorData?.channelId as unknown as IChannel)
      ?.channelCover,
    channelName: (moderatorData?.channelId as unknown as IChannel)?.channelName,
    authorName: (
      (moderatorData?.channelId as unknown as IChannel)
        ?.authorId as unknown as IUser
    )?.fullName,
    authorEmail: (
      (moderatorData?.channelId as unknown as IChannel)
        ?.authorId as unknown as IUser
    )?.email,
    moderatorName: (moderatorData?.userId as unknown as IUser)?.fullName,
    moderatorAvatar: (moderatorData?.userId as unknown as IUser)
      ?.avatar as string,
    moderatorEmail: (moderatorData?.userId as unknown as IUser)
      ?.email as string,
    dateAccepted: new Date(),
  };

  return await emailQueue.add(
    QueueJobList.SEND_MODERATOR_REQUEST_ACCEPTANCE_EMAIL,
    emailDetails,
    {
      removeOnComplete: true,
      removeOnFail: true,
    },
  );
};

export const ModeratorServices = {
  addModerator,
  acceptModerationRequest,
};
