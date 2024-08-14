import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import AppError from "../../errors/AppError";
import { CommunityPostServices } from "./community.post.services";
import { CommunityPostConstant } from "./community.post.constant";
import { ICommunityPost } from "./community.post.interface";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { CommunityPostModel } from "./model/model";
import { CommunityPostCache } from "./community.post.cache";

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

const findMySelectionPostOption = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, channelId } = req as IRequestWithActiveDetails;

  const result = await CommunityPostCache.findMySelectionPostOption(
    id,
    channelId || userId,
    channelId ? "channelId" : "userId",
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

  const { channelId } = req as IRequestWithActiveDetails;

  const result = await CommunityPostCache.findCommuityPostById(
    id,
    channelId as string,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post found succesfully",
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  const result = await CommunityPostCache.createPost({
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

const selectPollOrQuizOption = catchAsync(async (req, res) => {
  const { id, optionIndex: optionIndexString } = req.params;
  const { userId, channelId } = req as IRequestWithActiveDetails;

  const optionIndex = Number(optionIndexString);

  if (isNaN(optionIndex) || optionIndex < 0)
    throw new AppError(httpStatus.BAD_REQUEST, "option index is not valid");

  const result = await CommunityPostCache.selectPollOrQuizOption(
    id,
    optionIndex,
    channelId || userId,
    channelId ? "channelId" : "userId",
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post option selected or unselected succesfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommunityPostCache.updatePost(req.body, id);

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
  findMySelectionPostOption,
  findCommuityPostsMine,
  findCommuityPostById,
  createPost,
  updatePost,
  deletePost,
  selectPollOrQuizOption,
};
