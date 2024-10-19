import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ModeratorModel } from "./model/model";
import {
  IModerator,
  IModeratorPayload,
  IModeratorPopulated,
  IModeratorRemoveEmailData,
  IModeratorRequestAcceptanceEmailData,
  IModeratorRequestEmailData,
  IModeratorResignationEmailData,
} from "./moderator.interface";
import { emailQueue } from "../../queues/email/queue";
import { QueueJobList } from "../../queues";
import { TChannelRole, TDocumentType } from "../../interface/interface";
import { IChannel, IChannelPopulated } from "../channel/channel.interface";
import { IUser } from "../user/user.interface";
import { ChannelModel } from "../channel/model/model";
import mongoose from "mongoose";
import { UserModel } from "../user/model/model";
import QueryBuilder from "../../builder/QueryBuilder";
import { ModeratorConstant } from "./moderator.constant";

const getAllModerators = async (
  query: Record<string, unknown>,
  channelId: string,
  channelRole: TChannelRole,
) => {
  const moderatorTypeFilter =
    channelRole === "SUPER_MODERATOR"
      ? {
          $and: [
            { "permissions.moderator.add": false },
            { "permissions.moderator.canRemove": false },
          ],
        }
      : {};

  const chennelQuery = new QueryBuilder(
    ModeratorModel.find({
      channelId,
      ...moderatorTypeFilter,
    })
      .select({
        channelId: true,
        "permissions.moderator": true,
      })
      .populate({
        path: "userId",
        select: "-isVerified -createdAt -updatedAt",
      })
      .lean(),
    query,
  )
    .search(ModeratorConstant.MODERATOR_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await chennelQuery.countTotal();
  const moderatorsData =
    (await chennelQuery.modelQuery) as unknown as Array<IModeratorPopulated>;

  const result = moderatorsData.map((data: IModeratorPopulated) => ({
    ...data.userId,
    role:
      data.permissions.moderator?.add || data.permissions.moderator?.canRemove
        ? "SUPER MODERATOR"
        : "MODERATOR",
  }));

  return {
    meta,
    result,
  };
};

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
    }).select(
      "+moderatorCount +moderatorPendingCount",
    )) as TDocumentType<IModerator>;

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

    return {
      moderatorData,
      isRequesting: isPendingModerator,
    };
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

const resign = async (userId: string, moderatorId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const operationResult = (await ModeratorModel.resign(
      userId,
      moderatorId,
      session,
    )) as TDocumentType<IModerator>;

    if (!operationResult)
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "something went wrong. please try again",
      );

    const { channelId } = operationResult;

    const updatedChannelData = (await ChannelModel.findByIdAndUpdate(
      channelId,
      {
        $inc: { moderatorCount: -1 },
      },
      {
        new: true,
        session,
      },
    )
      .populate({
        path: "authorId",
        select: "fullName email",
      })
      .select("channelId channelAvatar")) as TDocumentType<IChannelPopulated>;

    const userData = (await UserModel.findById(userId)) as TDocumentType<IUser>;

    const emailDetails: IModeratorResignationEmailData = {
      authorName: updatedChannelData.authorId.fullName,
      authorEmail: updatedChannelData.authorId.email,
      moderatorName: userData.fullName,
      moderatorEmail: userData.email,
      channelName: updatedChannelData.channelName,
      channelId: updatedChannelData._id.toString(),
      leaveDate: new Date(),
    };

    await emailQueue.add(
      QueueJobList.SEND_MODERATOR_RESIGNATION_EMAIL,
      emailDetails,
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    await session.commitTransaction();
    return updatedChannelData;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * - first find the moderator data so that we can notify him by mail
 * - then deleting the moderator data
 * - if successful not deleted then throw an error
 * - update the channel moderator counts
 * - prepare email data
 * - add email to the email queue
 * - then return the updated channel data
 * ***/
const removeModerator = async (moderatorId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const targetedModerator = (await ModeratorModel.findById(
      moderatorId,
      null,
      {
        session,
      },
    )
      .select("userId channelId")
      .populate({
        path: "userId",
        select: "fullName email -_id",
      })) as unknown as TDocumentType<IModeratorPopulated>;

    const deletedModerator = await ModeratorModel.findByIdAndDelete(
      moderatorId,
      { session },
    );

    if (!deletedModerator)
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "something went wrong. please try again",
      );

    const {
      channelId: { _id: channelId },
    } = targetedModerator;

    const updatedChannelData = (await ChannelModel.findByIdAndUpdate(
      channelId,
      {
        $inc: { moderatorCount: -1 },
      },
      {
        new: true,
        session,
      },
    ).select("channelName")) as TDocumentType<IChannelPopulated>;

    const emailDetails: IModeratorRemoveEmailData = {
      moderatorName: targetedModerator.userId.fullName,
      channelName: updatedChannelData.channelName,
      moderatorEmail: targetedModerator.userId.email,
      removedDate: new Date(),
    };

    await emailQueue.add(
      QueueJobList.SEND_MODERATOR_REMOVE_EMAIL,
      emailDetails,
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    await session.commitTransaction();
    return updatedChannelData;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const ModeratorServices = {
  getAllModerators,
  addModerator,
  acceptModerationRequest,
  resign,
  removeModerator,
};
