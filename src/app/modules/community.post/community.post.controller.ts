import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import AppError from "../../errors/AppError";
import { CommunityPostServices } from "./community.post.services";
import { CommunityPostModel } from "./community.post.model";
import { CommunityPostConstant } from "./community.post.constant";
import { ICommunityPost } from "./community.post.interface";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const findCommuityPosts = catchAsync(async (req, res) => {
  const result = await CommunityPostServices.findCommuityPosts(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "posts found succesfully",
    data: result,
  });
});

const findCommuityPostsByChannelId = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityPostServices.findCommuityPostsByChannelId(
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

  const result = await CommunityPostServices.findCommuityPostsByChannelId(
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

  const result = await CommunityPostServices.findCommuityPostById(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post found succesfully",
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  const result = await CommunityPostServices.createPost({
    ...req.body,
    channelId,
  });

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "post created succesfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityPostServices.updatePost(req.body, id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post updated succesfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { channelId } = req as IRequestWithActiveDetails;

  const postData = await CommunityPostModel.findPostById(
    id,
    channelId as string,
  );

  if (!postData) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  const { postType, postImageDetails, postPollWithImageDetails } =
    postData as ICommunityPost;

  /* deleting images that are in that post */
  if (postType) {
    switch (postType) {
      case CommunityPostConstant.COMMUNITY_POST_TYPES.POLL_WITH_IMAGE: {
        const { options } = postPollWithImageDetails || {};

        if (options && options?.length) {
          const images = options.map((value) => value?.image);

          CloudinaryUtils.deleteFile([...images]);
        }

        break;
      }
      case CommunityPostConstant.COMMUNITY_POST_TYPES.IMAGE: {
        const { image } = postImageDetails || {};

        if (image) {
          CloudinaryUtils.deleteFile([image]);
        }
        break;
      }
    }
  }

  const result = await CommunityPostServices.deletePost(id);

  return sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: "post deleted succesfully",
    data: result,
  });
});

export const CommunityPostController = {
  findCommuityPosts,
  findCommuityPostsByChannelId,
  findCommuityPostsMine,
  findCommuityPostById,
  createPost,
  updatePost,
  deletePost,
};
