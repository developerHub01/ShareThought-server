import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catch.async";
import { UserModel } from "../user/model/model";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { ModeratorCache } from "./moderator.cache";
import { ModeratorServices } from "./moderator.services";
import { ChannelConstant } from "../channel/channel.constant";

const singleModerator = catchAsync(async (req, res) => {
  const {
    channelId,
    moderatorId: myModeratorId,
    channelRole,
  } = req as IRequestWithActiveDetails;

  const { moderatorId: targetedModeratorId } = req.params;

  /* NORMAL_MODERATORS are only allowed to view their own details. You cannot access information about other moderators */
  if (
    channelRole === ChannelConstant.CHANNEL_USER_ROLES.NORMAL_MODERATOR &&
    myModeratorId !== targetedModeratorId
  )
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Access denied: Only channel owners or super moderators can perform this action.",
    );

  const result = await ModeratorServices.singleModerator(
    channelId as string,
    myModeratorId as string,
    targetedModeratorId as string,
    channelRole,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "moderators list found successfully",
    data: result,
  });
});

const getAllModerators = catchAsync(async (req, res) => {
  const { channelId, channelRole } = req as IRequestWithActiveDetails;

  if (channelRole === ChannelConstant.CHANNEL_USER_ROLES.NORMAL_MODERATOR)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Access denied: Only channel owners or super moderators can perform this action.",
    );

  const result = await ModeratorServices.getAllModerators(
    req.query,
    channelId as string,
    channelRole,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "moderators list found successfully",
    data: result,
  });
});

const addModerator = catchAsync(async (req, res) => {
  const { userId } = req.body; /* userId ===> moderatorId */
  const { channelId } = req as IRequestWithActiveDetails;

  const userData = await UserModel.findById(userId);

  if (!userData) throw new AppError(httpStatus.NOT_FOUND, "user doesn't exist");

  if (!userData.isVerified)
    throw new AppError(httpStatus.FORBIDDEN, "user is not verified");

  const result = await ModeratorCache.addModerator(
    channelId as string,
    req.body,
  );

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "sent request for accepting moderator approval",
    data: result,
  });
});

const acceptModerationRequest = catchAsync(async (req, res) => {
  const { userId, moderatorId } = req as IRequestWithActiveDetails;

  const result = await ModeratorCache.acceptModerationRequest(
    userId,
    moderatorId as string,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "moderation request accepted",
    data: result,
  });
});

/* 
    TODO
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateModerator = catchAsync(async (req, res) => {
  // const { userId, moderatorId } = req as IRequestWithActiveDetails;
  // const result = await ModeratorCache.acceptModerationRequest(
  //   userId,
  //   moderatorId as string,
  // );
  // return sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: "moderation request accepted",
  //   data: result,
  // });
});

const resign = catchAsync(async (req, res) => {
  const { userId, moderatorId } = req as IRequestWithActiveDetails;

  const result = await ModeratorCache.resign(userId, moderatorId as string);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "moderation resigned successfully",
    data: result,
  });
});

const removeModerator = catchAsync(async (req, res) => {
  const { moderatorId } = req.params;

  const result = await ModeratorCache.removeModerator(moderatorId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "moderator removed successfully",
    data: result,
  });
});

export const ModeratorController = {
  singleModerator,
  getAllModerators,
  addModerator,
  acceptModerationRequest,
  updateModerator,
  resign,
  removeModerator,
};
