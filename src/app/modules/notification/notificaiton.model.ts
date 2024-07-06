import { model, Schema } from "mongoose";
import { NotificationConstant } from "./notification.constant";
import { INotification, INotificationModel } from "./notification.interface";
import { UserConstant } from "../user/user.constant";
import errorHandler from "../../errors/errorHandler";

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

export const NotificationModel = model<INotification, INotificationModel>(
  NotificationConstant.NOTIFICATION_COLLECTION_NAME,
  notificationSchema,
);
