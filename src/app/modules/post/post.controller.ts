import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { PostServices } from "./post.services";

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
  const result = await PostServices.deletePost(postId);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post deleted succesfully",
    data: result,
  });
});

export const PostController = { createPost, updatePost, deletePost };
