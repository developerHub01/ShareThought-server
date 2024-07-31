import { model } from "mongoose";
import { INotification, INotificationModel } from "../notification.interface";
import { NotificationConstant } from "../notification.constant";

/* notification schema start ==================== */
import notificationSchema from "./model.schema";
/* notification schema end ==================== */

/* notification schema middleware start ==================== */
import "./model.middleware";
/* notification schema middleware end ==================== */

/* notification schema static methods start ==================== */
import "./model.static.method";
/* notification schema static methods end ==================== */

export const NotificationModel = model<INotification, INotificationModel>(
  NotificationConstant.NOTIFICATION_COLLECTION_NAME,
  notificationSchema,
);
