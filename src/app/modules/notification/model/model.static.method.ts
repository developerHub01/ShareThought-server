import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { INotification } from "../notification.interface";
import notificationSchema from "./model.schema";
import { ChannelModel } from "../../channel/model/model";
import { NotificationModel } from "./model";

notificationSchema.statics.createNotification = async (
  payload: Partial<INotification>,
): Promise<unknown> => {
  return await NotificationModel.create({
    ...payload,
  });
};

notificationSchema.statics.numberOfMyUnseenNotification = async (
  userId: string,
): Promise<number | unknown> => {
  return (
    (await NotificationModel.countDocuments({ userId, isSeen: false })) || 0
  );
};
notificationSchema.statics.numberOfChannelUnseenNotification = async (
  channelId: string,
): Promise<number | unknown> => {
  return (
    (await NotificationModel.countDocuments({ channelId, isSeen: false })) || 0
  );
};

notificationSchema.statics.makeNotificationSeen = async (
  id: string,
  userId: string,
): Promise<number | unknown> => {
  const notificationData = await NotificationModel.findById(id);

  if (!notificationData)
    throw new AppError(httpStatus.NOT_FOUND, "Notification not found");

  const channelId = notificationData?.channelId?.toString();

  if (channelId) {
    await ChannelModel.isChannelMine({ channelId, authorId: userId });
  }

  return await NotificationModel.findByIdAndUpdate(
    id,
    { isSeen: true },
    { new: true },
  );
};
