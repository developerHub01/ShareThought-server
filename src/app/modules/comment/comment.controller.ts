import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { CommentServices } from "./comment.services";
import { IRequestWithUserId } from "../../interface/interface";

const findCommentByPostId = catchAsync(async (req, res) => {
  const { postId } = req.params;

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
  const result = await CommentServices.createComment(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment created succesfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { id } = req.params;

  const result = await CommentServices.updateComment(req.body, id, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "comment updated succesfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithUserId;
  const { id } = req.params;

  const result = await CommentServices.deleteComment(id, userId);
  
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
  updateComment,
  deleteComment,
};
