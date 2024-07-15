import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { ChannelServices } from "./channel.services";
import { IRequestWithUserId } from "../../interface/interface";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { ChannelModel } from "./channel.model";
import AppError from "../../errors/AppError";
import { ChannelUtils } from "./channel.utils";

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

const singleChannel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { author } = req.query;

  const result = await ChannelServices.singleChannel(id, Boolean(author));

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

  const channelData = await ChannelModel.findById(id);

  if (!channelData)
    throw new AppError(httpStatus.NOT_FOUND, "Channel not found");

  const { channelAvatar: previousAvatar, channelCover: previousCover } =
    channelData;

  const { channelAvatar, channelCover } = req.body;

  const channelAvatarPath = Array.isArray(channelAvatar) && channelAvatar[0];
  const channelCoverPath = Array.isArray(channelCover) && channelCover[0];

  if (channelAvatarPath) {
    const url = await ChannelUtils.updateChannelImage(
      channelAvatarPath,
      previousAvatar,
      CloudinaryConstant.SHARE_THOUGHT_CHANNEL_AVATAR_FOLDER_NAME,
    );

    if (url) req.body.channelAvatar = url;
  }

  if (channelCoverPath) {
    const url = await ChannelUtils.updateChannelImage(
      channelCoverPath,
      previousCover,
      CloudinaryConstant.SHARE_THOUGHT_CHANNEL_COVER_FOLDER_NAME,
    );

    if (url) req.body.channelCover = url;
  }

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
  singleChannel,
  getMyChannel,
  createChannel,
  updateChannel,
  deleteChannel,
};
