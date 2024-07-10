import { model, Schema } from "mongoose";
import { NotificationConstant } from "./notification.constant";
import { INotification, INotificationModel } from "./notification.interface";
import { UserConstant } from "../user/user.constant";
import errorHandler from "../../errors/errorHandler";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ChannelModel } from "../channel/channel.model";

const notificationSchema = new Schema<INotification, INotificationModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: UserConstant.USER_COLLECTION_NAME,
  },
  channelId: {
    type: Schema.Types.ObjectId,
    ref: UserConstant.USER_COLLECTION_NAME,
  },
  title: {
    type: String,
    required: true,
  },
  content: { type: String },
  notificationType: {
    type: String,
    enum: Object.values(NotificationConstant.NOTIFICATION_TYPES),
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: UserConstant.USER_COLLECTION_NAME,
  },
  isSeen: { type: Boolean, default: false },
});

notificationSchema.statics.createNotification = async (
  payload: Partial<INotification>,
): Promise<unknown> => {
  try {
    return await NotificationModel.create({
      ...payload,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

notificationSchema.statics.numberOfMyUnseenNotification = async (
  userId: string,
): Promise<number | unknown> => {
  try {
    return (
      (await NotificationModel.countDocuments({ userId, isSeen: false })) || 0
    );
  } catch (error) {
    return errorHandler(error);
  }
};
notificationSchema.statics.numberOfChannelUnseenNotification = async (
  channelId: string,
): Promise<number | unknown> => {
  try {
    return (
      (await NotificationModel.countDocuments({ channelId, isSeen: false })) ||
      0
    );
  } catch (error) {
    return errorHandler(error);
  }
};

notificationSchema.statics.makeNotificationSeen = async (
  id: string,
  userId: string,
): Promise<number | unknown> => {
  try {
    const notificationData = await NotificationModel.findById(id);

    if (!notificationData)
      throw new AppError(httpStatus.NOT_FOUND, "Notification not found");

    const channelId = notificationData?.channelId?.toString();

    let haveAccess = true;

    if (channelId) {
      await ChannelModel.isChannelMine(channelId, userId);
    }

    return await NotificationModel.findByIdAndUpdate(
      id,
      { isSeen: true },
      { new: true },
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const NotificationModel = model<INotification, INotificationModel>(
  NotificationConstant.NOTIFICATION_COLLECTION_NAME,
  notificationSchema,
);
