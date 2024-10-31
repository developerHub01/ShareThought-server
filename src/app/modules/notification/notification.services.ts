import QueryBuilder from "../../builder/QueryBuilder";
import { NotificationModel } from "./model/model";
import { INotification } from "./notification.interface";

const createNotification = async ({
  payload,
}: {
  payload: Partial<INotification>;
}) => {
  return await NotificationModel.createNotification(payload);
};

const findMyNotification = async ({
  query,
  userId,
}: {
  query: Record<string, unknown>;
  userId: string;
}) => {
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

const findChannelNotification = async ({
  query,
  channelId,
}: {
  query: Record<string, unknown>;
  channelId: string;
}) => {
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

const findMyUnseenNotification = async ({
  query,
  userId,
}: {
  query: Record<string, unknown>;
  userId: string;
}) => {
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
};

const findChannelUnseenNotification = async ({
  query,
  channelId,
}: {
  query: Record<string, unknown>;
  channelId: string;
}) => {
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
};

const numberOfMyUnseenNotification = async ({ userId }: { userId: string }) => {
  return await NotificationModel.numberOfMyUnseenNotification(userId);
};

const numberOfChannelUnseenNotification = async ({
  channelId,
}: {
  channelId: string;
}) => {
  return await NotificationModel.numberOfMyUnseenNotification(channelId);
};

const makeNotificationSeen = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return await NotificationModel.makeNotificationSeen(id, userId);
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
