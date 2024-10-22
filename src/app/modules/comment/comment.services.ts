import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TAuthorType, TPostType } from "../../interface/interface";
import { TChannelRole } from "../channel/channel.interface";
import { IModeratorPermissions } from "../moderator/moderator.interface";
import { ICreateComment } from "./comment.interface";
import { CommentModel } from "./model/model";

const findCommentByPostId = async (
  query: Record<string, unknown>,
  postId: string,
  postType: TPostType,
) => {
  const commentQuery = new QueryBuilder(
    CommentModel.find({
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      parentCommentId: { $exists: false },
    }).populate({
      path: "commentAuthorId",
      select: "fullName avatar",
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await commentQuery.countTotal();
  const result = await commentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const findCommentById = async (commentId: string) => {
  return await CommentModel.findComment(commentId);
};

const createComment = async (
  payload: ICreateComment,
  postId: string,
  postType: TPostType,
  authorId: string,
  authorType: TAuthorType,
) => {
  payload = {
    ...payload,
    ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
    ...(authorType === "channelId"
      ? { commentAuthorChannelId: authorId }
      : { commentAuthorId: authorId }),
  };

  return await CommentModel.createComment(payload);
};

const replyComment = async (
  payload: ICreateComment,
  parentCommentId: string,
  authorId: string,
  authorType: TAuthorType,
) => {
  payload = {
    ...payload,
    parentCommentId,
    ...(authorType === "channelId"
      ? { commentAuthorChannelId: authorId }
      : { commentAuthorId: authorId }),
  };

  return await CommentModel.createComment(payload);
};

const updateComment = async (payload: ICreateComment, commentId: string) => {
  return await CommentModel.updateComment(payload, commentId);
};

const deleteComment = async (commentId: string) => {
  return await CommentModel.deleteComment(commentId);
};

const deleteAllComment = async (postId: string, postType: TPostType) => {
  return await CommentModel.deleteAllCommentByPostId(postId, postType);
};

const removeCommentImageField = async (commentId: string) => {
  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      $unset: { commentImage: 1 },
    },
    { new: true },
  );
};

const togglePinComment = async (
  commentId: string,
  channelRole: TChannelRole,
  moderatorPermissions: IModeratorPermissions | undefined,
) => {
  const commentData = await CommentModel.findById(commentId);

  if (!commentData)
    throw new AppError(httpStatus.NOT_FOUND, "comment not found");

  const { isPinned: commentPinStatus } = commentData;

  const canPermissionToPinOrUnpin =
    (commentPinStatus && !moderatorPermissions?.comment?.unpin) ||
    (!commentPinStatus && !moderatorPermissions?.comment?.pin);

  if (channelRole !== "AUTHOR" && canPermissionToPinOrUnpin)
    throw new AppError(
      httpStatus.FORBIDDEN,
      `you are not permitted to ${commentPinStatus ? "unpin" : "pin"} comment`,
    );

  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      isPinned: !commentPinStatus,
    },
    { new: true },
  );
};

const toggleVisibility = async (
  commentId: string,
  channelRole: TChannelRole,
  moderatorPermissions: IModeratorPermissions | undefined,
) => {
  const commentData = await CommentModel.findById(commentId);

  if (!commentData)
    throw new AppError(httpStatus.NOT_FOUND, "comment not found");

  const { isHidden: commentHiddenStatus } = commentData;

  const canPermissionToHideOrUnhide =
    (commentHiddenStatus && !moderatorPermissions?.comment?.show) ||
    (!commentHiddenStatus && !moderatorPermissions?.comment?.hide);

  if (channelRole !== "AUTHOR" && canPermissionToHideOrUnhide)
    throw new AppError(
      httpStatus.FORBIDDEN,
      `you are not permitted to ${commentHiddenStatus ? "unhide" : "hide"} comment`,
    );

  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      isHidden: !commentHiddenStatus,
    },
    { new: true },
  );
};

export const CommentServices = {
  findCommentByPostId,
  findCommentById,
  replyComment,
  createComment,
  updateComment,
  deleteComment,
  deleteAllComment,
  removeCommentImageField,
  togglePinComment,
  toggleVisibility,
};
