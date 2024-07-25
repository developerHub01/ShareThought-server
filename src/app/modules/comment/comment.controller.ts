import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { CommentServices } from "./comment.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { CommentUtils } from "./comment.utils";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { CommentModel } from "./comment.model";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const findCommentByPostId = catchAsync(async (req, res) => {
  const { id: postId } = req.params;

  const result = await CommentServices.findCommentByPostId(req.query, postId);

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
  const { userId } = req as IRequestWithActiveDetails;
  const { id: postId } = req.params;

  let commentImagePath;

  if (req?.body?.commentImage?.length)
    commentImagePath = req?.body?.commentImage[0];

  if (commentImagePath) {
    const commentImage = await CommentUtils.uploadCommentImage(
      commentImagePath,
      CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      false,
    );
    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.createComment(req.body, postId, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment created succesfully",
    data: result,
  });
});

const replyComment = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;
  const { id: parentCommentId } = req.params; // commentId of parent comment

  let commentImagePath;

  if (req?.body?.commentImage?.length)
    commentImagePath = req?.body?.commentImage[0];

  if (commentImagePath) {
    const commentImage = await CommentUtils.uploadCommentImage(
      commentImagePath,
      CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      false,
    );

    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.replyComment(
    req.body,
    userId,
    parentCommentId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "replied succesfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;
  const { id } = req.params;

  const previousCommentImage = (await CommentModel.findById(id))?.commentImage;

  let commentImagePath;

  if (req?.body?.commentImage?.length)
    commentImagePath = req?.body?.commentImage[0];

  if (commentImagePath) {
    const commentImage = await CommentUtils.uploadCommentImage(
      commentImagePath,
      CloudinaryConstant.SHARE_THOUGHT_COMMENT_FOLDER_NAME,
      true,
      previousCommentImage,
    );

    req.body.commentImage = commentImage;
  }

  const result = await CommentServices.updateComment(req.body, id, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment updated succesfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;
  const { id } = req.params;

  const commentImage = (await CommentModel.findById(id))?.commentImage;

  if (commentImage) {
    await CloudinaryUtils.deleteFile([commentImage]);
  }

  const result = await CommentServices.deleteComment(id, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
    data: result,
  });
});

const deleteCommentImage = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommentServices.deleteCommentImage(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
    data: result,
  });
});

const deleteAllComment = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;
  const { id } = req.params;

  const result = await CommentServices.deleteAllComment(id, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment deleted succesfully",
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
  deleteCommentImage,
};
