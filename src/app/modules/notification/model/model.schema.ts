import { Schema } from "mongoose";
import { INotification, INotificationModel } from "../notification.interface";
import { UserConstant } from "../../user/user.constant";
import { NotificationConstant } from "../notification.constant";

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

export default notificationSchema;
