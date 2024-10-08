import { ChannelConstant } from "./channel.constant";
import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { ChannelServices } from "./channel.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { ChannelModel } from "./model/model";
import AppError from "../../errors/AppError";
import { ChannelUtils } from "./channel.utils";
import { AuthUtils } from "../auth/auth.utils";
import config from "../../config";
import { ChannelCache } from "./channel.cache";

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
  const { userId } = req as IRequestWithActiveDetails;

  const result = await ChannelServices.getChannelOfMine(req.query, userId);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel found succesfully",
    data: result,
  });
});

const singleChannel = catchAsync(async (req, res) => {
  const { channelId: activeChannelId } = req as IRequestWithActiveDetails;

  const { id: channelId } = req.params;

  let result;

  /*
   *
   * if any channelId not exist in params means it can be my own channel
   *
   */
  if (!channelId) {
    /*
     *
     * if any channelId and activeChannelId not exist then
     *
     */
    if (!activeChannelId)
      throw new AppError(httpStatus.UNAUTHORIZED, "no channel activated");

    /*
     *
     * find my activated channel data
     *
     */
    result = await ChannelCache.singleChannel(
      activeChannelId,
      activeChannelId === channelId,
    );
  } else
    result = await ChannelCache.singleChannel(
      channelId,
      activeChannelId === channelId,
    );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel found succesfully",
    data: result,
  });
});

const createChannel = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;
  req.body.authorId = userId;

  const result = await ChannelCache.createChannel(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel created succesfully",
    data: result,
  });
});

const updateChannel = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "your channel is not activated");

  const channelData = await ChannelModel.findById(channelId);

  if (!channelData)
    throw new AppError(httpStatus.NOT_FOUND, "Channel not found");

  const { channelAvatar: previousAvatar, channelCover: previousCover } =
    channelData;

  const { channelAvatar, channelCover } = req.body;

  if (channelAvatar) {
    const url = await ChannelUtils.updateChannelImage(
      channelAvatar,
      previousAvatar,
      CloudinaryConstant.SHARE_THOUGHT_CHANNEL_AVATAR_FOLDER_NAME,
      {
        width: ChannelConstant.CHANNEL_AVATAR_SIZE.WIDTH,
        height: ChannelConstant.CHANNEL_AVATAR_SIZE.HEIGHT,
      },
    );

    if (url) req.body.channelAvatar = url;
  }

  if (channelCover) {
    const url = await ChannelUtils.updateChannelImage(
      channelCover,
      previousCover,
      CloudinaryConstant.SHARE_THOUGHT_CHANNEL_COVER_FOLDER_NAME,
      {
        width: ChannelConstant.CHANNEL_COVER_SIZE.WIDTH,
        height: ChannelConstant.CHANNEL_COVER_SIZE.HEIGHT,
      },
    );

    if (url) req.body.channelCover = url;
  }

  const result = await ChannelCache.updateChannel(channelId, req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel updated succesfully",
    data: result,
  });
});

const deleteChannel = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "your channel is not activated");

  const result = ChannelCache.deleteChannel(channelId);

  return sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: "channel deleted succesfully",
    data: result,
  });
});

const switchChannel = catchAsync(async (req, res) => {
  const { id: channelId } = req.params;
  const { userId } = req as IRequestWithActiveDetails;

  if (!(await ChannelModel.isChannelMine(channelId, userId)))
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your channel");

  const channelToken = AuthUtils.createToken(
    { channelId },
    config?.JWT_ACCESS_SECRET as string,
    config?.JWT_ACCESS_EXPIRES_IN as string,
  );

  res.cookie("channel_token", channelToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel swtiched succesfully",
    data: {
      channelId,
    },
  });
});

const logOutChannel = catchAsync(async (req, res) => {
  res.clearCookie("channel_token");

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel logged out succesfully",
    data: null,
  });
});

export const ChannelController = {
  findChannel,
  singleChannel,
  getMyChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  switchChannel,
  logOutChannel,
};
