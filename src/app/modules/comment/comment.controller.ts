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

  const result = await CommentServices.findCommentByPostId(
    req.query,
    postId || communityPostId,
    postId ? "blogPost" : "communityPost",
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post comments found succesfully",
    data: result,
  });
});

const findCommentById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommentServices.findCommentById(id);

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
    const commentImage = await CommentUtils.uploadCommentImage(
      req.body?.commentImage,
      CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      false,
    );
    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.createComment(
    req.body,
    postId || communityPostId,
    postId ? "blogPost" : "communityPost",
    channelId || userId,
    channelId ? "channelId" : "userId",
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment created succesfully",
    data: result,
  });
});

const replyComment = catchAsync(async (req, res) => {
  const { userId, channelId } = req as IRequestWithActiveDetails;
  const { id: parentCommentId } = req.params; // commentId of parent comment

  if (req.body?.commentImage) {
    const commentImage = await CommentUtils.uploadCommentImage(
      req.body?.commentImage,
      CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      false,
    );

    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.replyComment(
    req.body,
    parentCommentId,
    channelId || userId,
    channelId ? "channelId" : "userId",
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "replied succesfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const isRemovingImage =
    req.body.commentImage && !req.body?.commentImage?.length;

  const previousCommentImage = (await CommentModel.findById(id))?.commentImage;

  if (req.body?.commentImage) {
    const commentImage = await CommentUtils.uploadCommentImage(
      req.body?.commentImage,
      CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      true,
      previousCommentImage,
    );

    req.body.commentImage = commentImage;
  }

  if (isRemovingImage && previousCommentImage) {
    await CloudinaryUtils.deleteFile([previousCommentImage]);
    CommentServices.removeCommentImageField(id);
    delete req.body["commentImage"];
  }

  const result = await CommentServices.updateComment(req.body, id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment updated succesfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const commentImage = (await CommentModel.findById(id))?.commentImage;

  if (commentImage) {
    await CloudinaryUtils.deleteFile([commentImage]);
  }

  const result = await CommentServices.deleteComment(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
    data: result,
  });
});

const deleteAllComment = catchAsync(async (req, res) => {
  const { postId, communityPostId } = req.params;

  const result = await CommentServices.deleteAllComment(
    postId || communityPostId,
    postId ? "blogPost" : "communityPost",
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
    data: result,
  });
});

const togglePinComment = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const result = await CommentServices.togglePinComment(commentId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `comment ${result?.isPinned ? "pinned" : "unpinned"} succesfully`,
    data: result,
  });
});

const toggleVisibility = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;

  const result = await CommentServices.toggleVisibility(commentId);

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
