import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { PostModel } from "../modules/post/model/model";

const verifyMyPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.UNAUTHORIZED, "no channel activated");

  const result = await PostModel.isMyPost(postId, channelId);

  if (!result)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your post");

  return next();
});

export default verifyMyPost;
