import httpStatus from "http-status";
import { IRequestWithActiveDetails } from "../../interface/interface";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { FollowerServices } from "./follwer.services";
import AppError from "../../errors/AppError";

const getChannelFollowing = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await FollowerServices.getChannelFollowing(req.query, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my following channel found succesfully",
    data: result,
  });
});
const getChannelFollowers = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "your channel is not activated");

  const result = await FollowerServices.getChannelFollowers(
    req.query,
    channelId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my following channel found succesfully",
    data: result,
  });
});

const handleChannelFollowToggle = catchAsync(async (req, res) => {
  const { userId, channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "your channel is not activated");

  const result = await FollowerServices.handleChannelFollowToggle(
    channelId,
    userId,
  );

  const isFollowing = !(result as typeof result & { deletedCount: number })
    .deletedCount;

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my following channel succesfully",
    data: {
      isFollowing,
      result,
    },
  });
});

export const FollowerController = {
  getChannelFollowing,
  getChannelFollowers,
  handleChannelFollowToggle,
};
