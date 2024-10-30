import httpStatus from "http-status";
import { PostModel } from "./model";
import postSchema from "./model.schema";
import AppError from "../../../errors/AppError";

postSchema.statics.isPostOfMyAnyChannel = async (
  userId: string,
  postId: string,
): Promise<boolean> => {
  const postData = await PostModel.findById(postId, "channelId").populate({
    path: "channelId",
    select: "authorId -_id",
  });

  if (!postData || !postData?.channelId) return false;

  const {
    channelId: { authorId },
  } = postData as unknown as { channelId: { authorId: string } };

  return userId === authorId?.toString();
};

/* check is a post is mine or not */
postSchema.statics.isMyPost = async (
  postId: string,
  channelId: string,
): Promise<boolean> => {
  const { channelId: postChannelId } =
    (await PostModel.findById(postId).select("channelId -_id")) || {};

  if (!postChannelId)
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  return channelId === postChannelId?.toString();
};

/* find single post by id */
postSchema.statics.findPostById = async (
  id: string,
  channelId: string,
): Promise<unknown> => {
  const postDetails = await PostModel.findById(id);

  if (!postDetails) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  const { isPublished } = postDetails;

  if (channelId && !isPublished && !(await PostModel.isMyPost(id, channelId)))
    throw new AppError(httpStatus.NOT_FOUND, "post not found");

  return postDetails;
};

/* is public post check by id */
postSchema.statics.isPublicPostById = async (
  id: string,
): Promise<boolean | unknown> => {
  const { isPublished } = (await PostModel.findById(id)) || {};
  return Boolean(isPublished);
};
