import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { CommentModel } from "../modules/comment/model/model";

const haveAccessDeleteComment = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { userId, channelId } = req as IRequestWithActiveDetails;

  const result = await CommentModel.haveAccessToDelete({
    commentId,
    authorId: channelId || userId,
    authorType: channelId ? "channelId" : "userId",
  });

  if (!result)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "you don't have access to delete that comment",
    );

  return next();
});

export default haveAccessDeleteComment;
