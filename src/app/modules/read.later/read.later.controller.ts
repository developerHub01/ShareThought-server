import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithUserId } from "../../interface/interface";
import { ReadLaterServices } from "./read.later.services";

const findReadLaterList = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await ReadLaterServices.findReadLaterList(req.query, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my read later list found succesfully",
    data: result,
  });
});

const isExistInReadLaterList = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { postId } = req.params;

  const result = await ReadLaterServices.isExistInReadLaterList(postId, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my read later list found succesfully",
    data: result,
  });
});

const addToReadLaterList = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { postId } = req.params;

  const result = await ReadLaterServices.addToReadLaterList(postId, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post added to read later succesfully",
    data: result,
  });
});

const removeFromReadLaterListById = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { id } = req.params;

  const result = await ReadLaterServices.removeFromReadLaterListById(
    id,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "removed post from read later succesfully",
    data: result,
  });
});

const removeFromReadLaterList = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { postId } = req.params;
  const result = await ReadLaterServices.removeFromReadLaterList(
    postId,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "removed post from read later succesfully",
    data: result,
  });
});

export const ReadLaterController = {
  findReadLaterList,
  isExistInReadLaterList,
  addToReadLaterList,
  removeFromReadLaterListById,
  removeFromReadLaterList,
};
