import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { PostModel } from "../modules/post/model/model";
import { CommunityPostModel } from "../modules/community.post/model/model";

const isMyPost = catchAsync(async (req, res, next) => {
  const { postId, communityPostId } = req.params;
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.UNAUTHORIZED, "no channel activated");

  let postData;

  if (postId) postData = await PostModel.findById(postId);
  else if (communityPostId) postData = await CommunityPostModel.findById(postId);

  if (!postData) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  if (postData.channelId?.toString() !== channelId) return next();

  (req as IRequestWithActiveDetails).isMyPost = true;
  return next();
});

export default isMyPost;
