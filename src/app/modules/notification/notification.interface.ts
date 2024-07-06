import { Model, Types } from "mongoose";
import { NotificationConstant } from "./notification.constant";

const notificationTypes = Object.values(
  NotificationConstant.NOTIFICATION_TYPES,
);

export type TNotificationType = (typeof notificationTypes)[number];

export interface INotification {
  userId?: Types.ObjectId;
  channelId?: Types.ObjectId;
  title: string;
  content: string;
  notificationType: TNotificationType;
  postId: Types.ObjectId;
  isSeen: boolean;
}
export interface INotificationModel extends Model<INotification> {
  createNotification(payload: Partial<INotification>): Promise<unknown>;
}
