import httpStatus from "http-status";
import { IRequestWithUserId } from "../../interface/interface";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { FollowerServices } from "./follwer.services";

const getChannelFollowing = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;

  const result = await FollowerServices.getChannelFollowing(req.query, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my following channel found succesfully",
    data: result,
  });
});
const getChannelFollowers = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await FollowerServices.getChannelFollowers(req.query, id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my following channel found succesfully",
    data: result,
  });
});

const handleChannelFollowToggle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req as IRequestWithUserId;

  const result = await FollowerServices.handleChannelFollowToggle(id, userId);

  const isFollowing = Boolean(
    (result as typeof result & { deletedCount: number }).deletedCount,
  );

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
