import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { NotificationModel } from "./notificaiton.model";
import { INotification } from "./notification.interface";

const createNotification = async (payload: Partial<INotification>) => {
  try {
    return await NotificationModel.createNotification(payload);
  } catch (error) {
    return errorHandler(error);
  }
};

const findMyNotification = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const notificationQuery = new QueryBuilder(
    NotificationModel.find({ userId }).populate({
      path: "userId",
      select: "fullName avatar",
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await notificationQuery.countTotal();
  const result = await notificationQuery.modelQuery;

  return {
    meta,
    result,
  };
};
const findChannelNotification = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  const notificationQuery = new QueryBuilder(
    NotificationModel.find({ channelId }).populate({
      path: "userId",
      select: "fullName avatar",
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await notificationQuery.countTotal();
  const result = await notificationQuery.modelQuery;

  return {
    meta,
    result,
  };
};

export const NotificationServices = {
  createNotification,
  findMyNotification,
  findChannelNotification,
};
