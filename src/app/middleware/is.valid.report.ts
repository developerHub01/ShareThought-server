import { ChannelModel } from "../modules/channel/model/model";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { PostModel } from "../modules/post/model/model";
import { CommentModel } from "../modules/comment/model/model";

const isValidReport = catchAsync(async (req, res, next) => {
  const { userId } = req as IRequestWithActiveDetails;

  if (
    !(
      req.body.contextChannel ||
      req.body.contextBlogPost ||
      req.body.contextCommunityPost ||
      req.body.contextComment
    )
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "report must contain channel, post or comment id",
    );

  if (req.body.contextChannel) {
    const reportedChannelId = req.body.contextChannel;

    if (
      await ChannelModel.isChannelMine({
        channelId: reportedChannelId,
        authorId: userId,
      })
    )
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't report their own channel",
      );
  } else if (req.body.contextBlogPost) {
    const reportedPostId = req.body.contextBlogPost;

    if (
      await PostModel.isPostOfMyAnyChannel({ userId, postId: reportedPostId })
    )
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't report their own post",
      );
  } else if (req.body.contextCommunityPost) {
    const reportedPostId = req.body.contextCommunityPost;

    if (
      await PostModel.isPostOfMyAnyChannel({ userId, postId: reportedPostId })
    )
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't report their own post",
      );
  } else if (req.body.contextComment) {
    const reportedCommentId = req.body.contextComment;

    if (await CommentModel.isCommentOfMyAnyChannel(userId, reportedCommentId))
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user can't report their own comment",
      );
  }

  return next();
});

export default isValidReport;
