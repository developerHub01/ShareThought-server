import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { ChannelServices } from "./channel.services";
import { IRequestWithUserId } from "../../interface/interface";

const findChannel = catchAsync(async (req, res) => {
  const result = await ChannelServices.findChannel(req.query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel found succesfully",
    data: result,
  });
});
const getMyChannel = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await ChannelServices.getChannelOfMine(req.query, userId);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel found succesfully",
    data: result,
  });
});

const getChannelById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { author } = req.query;

  const result = await ChannelServices.getChannelById(id, Boolean(author));

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel found succesfully",
    data: result,
  });
});

const createChannel = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  req.body.authorId = userId;

  const result = await ChannelServices.createChannel(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel created succesfully",
    data: result,
  });
});

const updateChannel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ChannelServices.updateChannel(id, req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel updated succesfully",
    data: result,
  });
});

const deleteChannel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = ChannelServices.deleteChannel(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel deleted succesfully",
    data: result,
  });
});

export const ChannelController = {
  findChannel,
  getMyChannel,
  createChannel,
  deleteChannel,
  getChannelById,
  updateChannel,
};
