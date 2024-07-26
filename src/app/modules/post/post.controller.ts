import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { PostServices } from "./post.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { PostUtils } from "./post.utils";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { PostModel } from "./post.model";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

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

  const { channelId } = req as IRequestWithActiveDetails;

  const result = await PostServices.findPostByChannelId(
    req.query,
    id,
    channelId as string,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "post details found succesfully",
    data: result,
  });
});

const findPostByPostId = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const { channelId } = req as IRequestWithActiveDetails;

  const result = await PostServices.findPostByPostId(postId, channelId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result ? "post details found succesfully" : "Post not found",
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const { channelId } = req as IRequestWithActiveDetails;

  req.body.channelId = channelId;

  let bannerPath;

  if (req?.body?.banner?.length) bannerPath = req?.body?.banner[0];

  if (bannerPath) {
    const bannerImage = await PostUtils.createOrUpdatePostImage(
      bannerPath,
      CloudinaryConstant.SHARE_THOUGHT_POST_BANNER_FOLDER_NAME,
      false,
    );
    req.body.banner = bannerImage;
  }

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

  const previousBannerImage = (await PostModel.findById(postId))?.banner;

  let bannerPath;

  if (req?.body?.banner?.length) bannerPath = req?.body?.banner[0];

  if (bannerPath) {
    const bannerImage = await PostUtils.createOrUpdatePostImage(
      bannerPath,
      CloudinaryConstant.SHARE_THOUGHT_POST_BANNER_FOLDER_NAME,
      true,
      previousBannerImage,
    );

    req.body.banner = bannerImage;
  }

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
  const { channelId } = req as IRequestWithActiveDetails;

  const bannerImage = (await PostModel.findById(postId))?.banner;

  if (bannerImage) {
    await CloudinaryUtils.deleteFile([bannerImage]);
  }

  const result = await PostServices.deletePost(postId, channelId as string);

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
