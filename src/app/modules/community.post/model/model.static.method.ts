import httpStatus from "http-status";
import { CommunityPostModel } from "./model";
import communityPostSchema from "./model.schema";
import AppError from "../../../errors/AppError";

/* static methods start ============================================= */
communityPostSchema.statics.isPostOfMyAnyChannel = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}): Promise<boolean> => {
  const postData = await CommunityPostModel.findById(
    postId,
    "channelId",
  ).populate({
    path: "channelId",
    select: "authorId -_id",
  });

  if (!postData || !postData?.channelId) return false;

  const {
    channelId: { authorId },
  } = postData as unknown as { channelId: { authorId: string } };

  return userId === authorId?.toString();
};

communityPostSchema.statics.isMyPost = async ({
  communityPostId,
  channelId,
}: {
  communityPostId: string;
  channelId: string;
}): Promise<boolean> => {
  const { channelId: postChannelId } =
    (await CommunityPostModel.findById(communityPostId).select(
      "channelId -_id",
    )) || {};

  if (!postChannelId)
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");

  return channelId === postChannelId?.toString();
};

communityPostSchema.statics.findPostById = async ({
  communityPostId,
  channelId,
}: {
  communityPostId: string;
  channelId?: string;
}): Promise<unknown> => {
  const postData = await CommunityPostModel.findById(communityPostId);

  if (!postData) throw new AppError(httpStatus.NOT_FOUND, "post not found");

  const { isPublished } = postData;

  if (
    channelId &&
    !isPublished &&
    !(await CommunityPostModel.isMyPost({ communityPostId, channelId }))
  )
    throw new AppError(httpStatus.NOT_FOUND, "post not found");

  return postData;
};

communityPostSchema.statics.isPublicPostById = async ({
  communityPostId,
}: {
  communityPostId: string;
}): Promise<boolean | unknown> => {
  const { isPublished } =
    (await CommunityPostModel.findById(communityPostId)) || {};
  return Boolean(isPublished);
};
