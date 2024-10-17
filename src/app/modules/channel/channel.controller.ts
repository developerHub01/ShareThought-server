import { ChannelConstant } from "./channel.constant";
import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { ChannelServices } from "./channel.services";
import {
  IRequestWithActiveDetails,
  TDocumentType,
} from "../../interface/interface";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { ChannelModel } from "./model/model";
import AppError from "../../errors/AppError";
import { ChannelUtils } from "./channel.utils";
import { AuthUtils } from "../auth/auth.utils";
import config from "../../config";
import { ChannelCache } from "./channel.cache";
import { IModerator } from "../moderator/moderator.interface";
import { Constatnt } from "../../constants/constants";
import { ModeratorModel } from "../moderator/model/model";

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
    message: "channels found succesfully",
    data: result,
  });
});

const getMyModeratedChannel = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await ChannelServices.getMyModeratedChannel(req.query, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channels found succesfully",
    data: result,
  });
});

const singleChannel = catchAsync(async (req, res) => {
  const { channelId: activeChannelId } = req as IRequestWithActiveDetails;

  const { id: channelId } = req.params;

  let result;

  /*
   * if any channelId not exist in params means it can be my own channel
   */
  if (!channelId) {
    /*
     * if any channelId and activeChannelId not exist then
     */
    if (!activeChannelId)
      throw new AppError(httpStatus.UNAUTHORIZED, "no channel activated");

    /*
     * find my activated channel data
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


/* 
- if user is the channel owner then create a channel_token and pass it in cookies
- if user is not the channel owner then check that is he is moderator or not
- if user it moderator then with channel_token create another token moderator_token and pass it in cookies
- if nighter then throw an error that user have not authenticated to switch to the channel 
*/
const switchChannel = catchAsync(async (req, res) => {
  const { id: channelId } = req.params;
  const { userId } = req as IRequestWithActiveDetails;

  let moderatorId: string = "";

  if (!(await ChannelModel.isChannelMine(channelId, userId))) {
    const moderatorData = (await ModeratorModel.channelModeratorData(
      channelId,
      userId,
    )) as TDocumentType<IModerator>;

    if (!moderatorData)
      throw new AppError(httpStatus.UNAUTHORIZED, "This is not your channel");

    moderatorId = moderatorData._id.toString();
  }

  const channelToken = AuthUtils.createToken(
    { channelId },
    config?.JWT_CHANNEL_ACCESS_SECRET as string,
  );

  const moderatorToken =
    moderatorId &&
    AuthUtils.createToken(
      { moderatorId },
      config?.JWT_MODERATOR_SECRET as string,
    );

  res.cookie(Constatnt.TOKENS.CHANNEL_TOKEN, channelToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  if (moderatorToken)
    res.cookie(Constatnt.TOKENS.MODERATOR_TOKEN, moderatorToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
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

const channelModeratorCount = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  const result = await ChannelCache.channelModeratorCount(channelId as string);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "channel moderator count found succesfully",
    data: result,
  });
});

export const ChannelController = {
  findChannel,
  singleChannel,
  getMyChannel,
  getMyModeratedChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  switchChannel,
  logOutChannel,
  channelModeratorCount,
};
