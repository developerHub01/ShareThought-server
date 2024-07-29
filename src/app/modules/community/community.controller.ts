import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { CommunityServices } from "./community.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import AppError from "../../errors/AppError";

const findCommuityPosts = catchAsync(async (req, res) => {
  const result = await CommunityServices.findCommuityPosts(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "posts found succesfully",
    data: result,
  });
});

const findCommuityPostsByChannelId = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityServices.findCommuityPostsByChannelId(
    req.query,
    id,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "posts found succesfully",
    data: result,
  });
});

const findCommuityPostsMine = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "you don't have any activated channel",
    );

  const result = await CommunityServices.findCommuityPostsByChannelId(
    req.query,
    channelId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "posts found succesfully",
    data: result,
  });
});

const findCommuityPostById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityServices.findCommuityPostById(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post found succesfully",
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const result = await CommunityServices.createPost(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "post created succesfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityServices.updatePost(req.body, id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post updated succesfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityServices.deletePost(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post deleted succesfully",
    data: result,
  });
});

export const CommunityController = {
  findCommuityPosts,
  findCommuityPostsByChannelId,
  findCommuityPostsMine,
  findCommuityPostById,
  createPost,
  updatePost,
  deletePost,
};
