import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { PostServices } from "./post.services";
import { IRequestWithUserId } from "../../interface/interface";

const findPost = catchAsync(async (req, res) => {
  const result = await PostServices.findPost(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post details found succesfully",
    data: result,
  });
});

const findPostByChannelId = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { userId } = req as IRequestWithUserId;

  const result = await PostServices.findPostByChannelId(req.query, id, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post details found succesfully",
    data: result,
  });
});

const findPostByPostId = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const { userId } = req as IRequestWithUserId;

  const result = await PostServices.findPostByPostId(postId, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result ? "post details found succesfully" : "Post not found",
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const { id } = req.params;

  req.body.channelId = id;

  const result = await PostServices.createPost(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post created succesfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await PostServices.updatePost(req.body, postId);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post updated succesfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { userId } = req as IRequestWithUserId;
  const result = await PostServices.deletePost(postId, userId);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post deleted succesfully",
    data: result,
  });
});

export const PostController = {
  findPostByPostId,
  findPost,
  findPostByChannelId,
  createPost,
  updatePost,
  deletePost,
};
