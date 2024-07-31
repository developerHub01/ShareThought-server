import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { NotificationModel } from "./model/model";
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
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const findChannelNotification = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const findMyUnseenNotification = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  try {
    const notificationQuery = new QueryBuilder(
      NotificationModel.find({ userId, isSeen: false }).populate({
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
  } catch (error) {
    errorHandler(error);
  }
};

const findChannelUnseenNotification = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  try {
    const notificationQuery = new QueryBuilder(
      NotificationModel.find({ channelId, isSeen: false }).populate({
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
  } catch (error) {
    errorHandler(error);
  }
};

const numberOfMyUnseenNotification = async (userId: string) => {
  try {
    return await NotificationModel.numberOfMyUnseenNotification(userId);
  } catch (error) {
    errorHandler(error);
  }
};

const numberOfChannelUnseenNotification = async (channelId: string) => {
  try {
    return await NotificationModel.numberOfMyUnseenNotification(channelId);
  } catch (error) {
    errorHandler(error);
  }
};

const makeNotificationSeen = async (id: string, userId: string) => {
  try {
    return await NotificationModel.makeNotificationSeen(id, userId);
  } catch (error) {
    errorHandler(error);
  }
};

export const NotificationServices = {
  createNotification,
  findMyNotification,
  findChannelNotification,
  findMyUnseenNotification,
  findChannelUnseenNotification,
  numberOfMyUnseenNotification,
  numberOfChannelUnseenNotification,
  makeNotificationSeen,
};
