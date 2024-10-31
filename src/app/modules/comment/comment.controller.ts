import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { CommentServices } from "./comment.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { CommentUtils } from "./comment.utils";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { CommentModel } from "./model/model";

const findCommentByPostId = catchAsync(async (req, res) => {
  const { postId, communityPostId } = req.params;

  const { isMyPost } = req as IRequestWithActiveDetails;

  const result = await CommentServices.findCommentByPostId({
    query: req.query,
    postId: postId || communityPostId,
    postType: postId ? "blogPost" : "communityPost",
    isMyPost,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post comments found succesfully",
    data: result,
  });
});

const findCommentById = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const { channelId } = req as IRequestWithActiveDetails;

  const result = await CommentServices.findCommentById({
    commentId,
    activeChannelId: channelId as string,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result ? "comment found succesfully" : "comment not found",
    data: result,
  });
});

const createComment = catchAsync(async (req, res) => {
  const { userId, channelId } = req as IRequestWithActiveDetails;
  const { postId, communityPostId } = req.params;

  if (req.body?.commentImage) {
    const commentImage = await CommentUtils.uploadCommentImage({
      imagePath: req.body?.commentImage,
      cloudinaryMediaPath: CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      isUpdating: false,
    });
    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.createComment({
    payload: req.body,
    postId: postId || communityPostId,
    postType: postId ? "blogPost" : "communityPost",
    authorId: channelId || userId,
    authorType: channelId ? "channelId" : "userId",
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment created succesfully",
    data: result,
  });
});

const replyComment = catchAsync(async (req, res) => {
  const { userId, channelId } = req as IRequestWithActiveDetails;
  const { id: parentCommentId } = req.params; /* commentId of parent comment */

  if (req.body?.commentImage) {
    const commentImage = await CommentUtils.uploadCommentImage({
      imagePath: req.body?.commentImage,
      cloudinaryMediaPath: CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      isUpdating: false,
    });

    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.replyComment({
    payload: req.body,
    parentCommentId,
    authorId: channelId || userId,
    authorType: channelId ? "channelId" : "userId",
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "replied succesfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const isRemovingImage =
    req.body.commentImage && !req.body?.commentImage?.length;

  const previousCommentImage = (await CommentModel.findById(commentId))
    ?.commentImage;

  if (req.body?.commentImage) {
    const commentImage = await CommentUtils.uploadCommentImage({
      imagePath: req.body?.commentImage,
      cloudinaryMediaPath: CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      isUpdating: true,
      previousImage: previousCommentImage,
    });

    req.body.commentImage = commentImage;
  }

  if (isRemovingImage && previousCommentImage) {
    await CloudinaryUtils.deleteFile([previousCommentImage]);
    CommentServices.removeCommentImageField({ commentId });
    delete req.body["commentImage"];
  }

  const result = await CommentServices.updateComment({
    payload: req.body,
    commentId,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment updated succesfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const commentImage = (await CommentModel.findById(commentId))?.commentImage;

  if (commentImage) {
    await CloudinaryUtils.deleteFile([commentImage]);
  }

  const result = await CommentServices.deleteComment({ commentId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
    data: result,
  });
});

const deleteAllComment = catchAsync(async (req, res) => {
  const { postId, communityPostId } = req.params;

  const result = await CommentServices.deleteAllComment({
    postId: postId || communityPostId,
    postType: postId ? "blogPost" : "communityPost",
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
    data: result,
  });
});

const togglePinComment = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const result = await CommentServices.togglePinComment({ commentId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `comment ${result?.isPinned ? "pinned" : "unpinned"} succesfully`,
    data: result,
  });
});

const toggleVisibility = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const result = await CommentServices.toggleVisibility({ commentId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `comment ${result?.isHidden ? "hide" : "unhide"} succesfully`,
    data: result,
  });
});

export const CommentController = {
  findCommentByPostId,
  findCommentById,
  createComment,
  replyComment,
  updateComment,
  deleteComment,
  deleteAllComment,
  togglePinComment,
  toggleVisibility,
};
