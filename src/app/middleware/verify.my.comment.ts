import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { IRequestWithUserId } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { CommentModel } from "../modules/comment/comment.model";

const verifyMyComment = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { userId } = req as IRequestWithUserId;

  const isMyComment = await CommentModel.isMyComment(commentId, userId);

  if (!isMyComment)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your comment");

  return next();
});

export default verifyMyComment;
