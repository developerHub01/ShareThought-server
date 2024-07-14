import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithUserId } from "../../interface/interface";
import { HistoryServices } from "./history.services";

const findHistoryItem = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await HistoryServices.findHistoryItem(req.query, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post details found succesfully",
    data: result,
  });
});

const isMyHistoryActive = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await HistoryServices.isMyHistoryActive(userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post details found succesfully",
    data: result,
  });
});

const toggleHistoryActivity = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await HistoryServices.toggleHistoryActivity(userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post details found succesfully",
    data: result,
  });
});

const addPostInHistory = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { postId } = req.params;

  const result = await HistoryServices.addPostInHistory(postId, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post added to history succesfully",
    data: result,
  });
});

const removePostFromHistory = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { id: historyItemId } = req.params;

  const result = await HistoryServices.removePostFromHistory(
    historyItemId,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${historyItemId} post removed from your history succesfully`,
    data: result,
  });
});

const clearPostFromHistory = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await HistoryServices.clearPostFromHistory(userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "history cleared succesfully",
    data: result,
  });
});

export const HistoryController = {
  findHistoryItem,
  isMyHistoryActive,
  toggleHistoryActivity,
  addPostInHistory,
  removePostFromHistory,
  clearPostFromHistory,
};
