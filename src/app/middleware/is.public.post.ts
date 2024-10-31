import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { PostModel } from "../modules/post/model/model";

const isPublicPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const result = await PostModel.isPublicPostById({ id: postId });

  if (!result)
    throw new AppError(httpStatus.UNAUTHORIZED, "this post is not public");

  return next();
});

export default isPublicPost;
