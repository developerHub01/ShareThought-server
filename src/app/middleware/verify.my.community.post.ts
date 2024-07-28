import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { CommunityModel } from "../modules/community/community.model";

const verifyMyCommunityPost = catchAsync(async (req, res, next) => {
  const { communityPostId } = req.params;
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.UNAUTHORIZED, "no channel activated");

  const result = await CommunityModel.isMyPost(communityPostId, channelId);

  if (!result)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your post");

  return next();
});

export default verifyMyCommunityPost;
