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
import { ChannelModel } from "../channel/model/model";
import mongoose from "mongoose";

/* 
- if that user is already a moderator then request not acceptable
- if that user is pending moderator then request acceptable only for sending emails
- if that user is not a moderator then request acceptable and other process will continue
*/
const addModerator = async (channelId: string, payload: IModeratorPayload) => {
  const { userId } = payload;

  if (await ModeratorModel.isAlreadyModerator(channelId, userId))
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "this user is already moderator of your channel",
    );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let moderatorData = (await ModeratorModel.findOne({
      channelId,
      userId,
    }).select({
      moderatorCount: true,
      moderatorPendingCount: true,
    })) as TDocumentType<IModerator>;

    if (moderatorData && moderatorData?.isVerified) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "this user is already moderator of your channel",
      );
    }

    /* checking that is that user is pending moderator or not */
    const isPendingModerator = moderatorData && !moderatorData?.isVerified;

    let moderatorId = moderatorData?._id.toString();

    /*
      if user have no moderator instance in that channel
      then create that moderator instance
    */
    if (!isPendingModerator) {
      const newModerator = (await ModeratorModel.addChannelModerator(
        channelId,
        payload,
      )) as TDocumentType<IModerator>;

      if (!newModerator)
        throw new AppError(httpStatus.FORBIDDEN, "something went wrong");

      moderatorId = newModerator?._id.toString();

      moderatorData = newModerator;
    }

    const moderatorFullData = await ModeratorModel.findById(moderatorId)
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
      channelCover: (moderatorFullData?.channelId as unknown as IChannel)
        ?.channelCover,
      channelAvatar: (moderatorFullData?.channelId as unknown as IChannel)
        ?.channelAvatar,
      channelName: (moderatorFullData?.channelId as unknown as IChannel)
        ?.channelName,
      moderatorName: (moderatorFullData?.userId as unknown as IUser)?.fullName,
      moderatorAvatar: (moderatorFullData?.userId as unknown as IUser)
        ?.avatar as string,
      moderatorEmail: (moderatorFullData?.userId as unknown as IUser)?.email,
    };

    await emailQueue.add(
      QueueJobList.SEND_MODERATOR_REQUEST_EMAIL,
      emailDetails,
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    /*
      if user have no moderator instance in that channel
      then update channel moderator count after moderator has been created
    */
    if (!isPendingModerator)
      await ChannelModel.findByIdAndUpdate(
        channelId,
        {
          $inc: {
            moderatorPendingCount: 1,
          },
        },
        { session },
      );

    await session.commitTransaction();
    return moderatorData;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const acceptModerationRequest = async (userId: string, moderatorId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newModerator = (await ModeratorModel.acceptModeratorRequest(
      userId,
      moderatorId,
      session,
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

    if (!moderatorData)
      throw new AppError(
        httpStatus.FORBIDDEN,
        "something went wrong. please try again",
      );
    const emailDetails: IModeratorRequestAcceptanceEmailData = {
      channelCover: (moderatorData?.channelId as unknown as IChannel)
        ?.channelCover,
      channelName: (moderatorData?.channelId as unknown as IChannel)
        ?.channelName,
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

    await emailQueue.add(
      QueueJobList.SEND_MODERATOR_REQUEST_ACCEPTANCE_EMAIL,
      emailDetails,
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    await ChannelModel.findByIdAndUpdate(
      moderatorData.channelId,
      {
        $inc: {
          moderatorPendingCount: -1,
          moderatorCount: 1,
        },
      },
      { session },
    );

    await session.commitTransaction();
    return newModerator;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const ModeratorServices = {
  addModerator,
  acceptModerationRequest,
};
