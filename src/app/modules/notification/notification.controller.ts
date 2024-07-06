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
    message: "notification found succesfully",
    data: result,
  });
});

export const NotificationController = {
  findMyNotification,
  findChannelNotification,
};
