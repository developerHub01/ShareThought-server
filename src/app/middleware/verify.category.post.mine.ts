import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { PostModel } from "../modules/post/post.model";

const verifyCategoryPostMine = catchAsync(async (req, res, next) => {
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your channel");

  const { postList } = req.body;

  if (!postList) return next();

  for (const postId of postList) {
    if (!(await PostModel.isMyPost(postId, channelId)))
      throw new AppError(httpStatus.UNAUTHORIZED, `${postId} is not your post`);

    const postData = await PostModel.findById(postId);
    if (!postData || !postData?.isPublished)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `${postId} is not public post`,
      );
  }

  return next();
});

export default verifyCategoryPostMine;
