import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { CommentModel } from "../modules/comment/comment.model";

const verifyMyComment = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { userId, channelId } = req as IRequestWithActiveDetails;

  const isMyComment = await CommentModel.isMyComment(
    commentId,
    channelId || userId,
    channelId ? "channelId" : "userId",
  );

  if (!isMyComment)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your comment");

  return next();
});

export default verifyMyComment;
