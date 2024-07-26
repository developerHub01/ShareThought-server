import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { CommentModel } from "../modules/comment/comment.model";

const haveAccessDeleteComment = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { userId, channelId } = req as IRequestWithActiveDetails;

  const result = await CommentModel.haveAccessToDelete(
    commentId,
    userId,
    channelId,
  );

  if (!result)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This is not your channel category",
    );

  return next();
});

export default haveAccessDeleteComment;
