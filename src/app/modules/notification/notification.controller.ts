import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { NotificationServices } from "./notification.services";
import { IRequestWithUserId } from "../../interface/interface";

const findMyNotification = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const result = await NotificationServices.findMyNotification(
    req.query,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "notification found succesfully",
    data: result,
  });
});

const findChannelNotification = catchAsync(async (req, res) => {
  const { id } = req.params; // id ===> channelId
  const result = await NotificationServices.findChannelNotification(
    req.query,
    id,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "number of notifications found succesfully",
    data: result,
  });
});

const findMyUnseenNotification = catchAsync(async (req, res) => {
  const { id } = req.params; // id ===> channelId
  const result = await NotificationServices.findChannelNotification(
    req.query,
    id,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "notification found succesfully",
    data: result,
  });
});

const findChannelUnseenNotification = catchAsync(async (req, res) => {
  const { id } = req.params; // id ===> channelId
  const result = await NotificationServices.findChannelNotification(
    req.query,
    id,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "notification found succesfully",
    data: result,
  });
});

const numberOfMyUnseenNotification = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const result =
    await NotificationServices.numberOfMyUnseenNotification(userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "number of notifications found succesfully",
    data: result,
  });
});

const numberOfChannelUnseenNotification = catchAsync(async (req, res) => {
  const { id } = req.params; // id ===> channelId
  const result =
    await NotificationServices.numberOfChannelUnseenNotification(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "number of notifications found succesfully",
    data: result,
  });
});

const makeNotificationSeen = catchAsync(async (req, res) => {
  const { id } = req.params; // id ===> channelId
  const result = await NotificationServices.findChannelNotification(
    req.query,
    id,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "notification found succesfully",
    data: result,
  });
});

export const NotificationController = {
  findMyNotification,
  findChannelNotification,
  findMyUnseenNotification,
  findChannelUnseenNotification,
  numberOfMyUnseenNotification,
  numberOfChannelUnseenNotification,
  makeNotificationSeen,
};
