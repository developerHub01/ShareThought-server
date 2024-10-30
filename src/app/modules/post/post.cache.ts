import { PostConstant } from "./post.constant";
import { TDocumentType } from "../../interface/interface";
import { RedisKeys } from "../../redis.keys";
import { ChannelCache } from "../channel/channel.cache";
import { ICreatePost } from "./post.interface";
import { PostServices } from "./post.services";
import { redis } from "../../config/redis.config";

const findPostByPostId = async ({
  postId,
  channelId,
}: {
  postId: string;
  channelId: string;
}) => {
  const postKey = RedisKeys.postKey(postId);
  const postDataJSON = await redis.get(postKey);

  /* if post data exist in chache */
  if (postDataJSON) {
    const postData = JSON.parse(postDataJSON);

    const {
      channelId: { _id: postChannelId },
    } = postData as unknown as { channelId: { _id: string } };

    /* retriving channel data from cache or database because it may change any time */
    const channelData = await ChannelCache.singleChannel(
      postChannelId,
      postChannelId === channelId,
    );

    /**
     *
     * Here channelData is null means actually channel is deleted so remove post also.
     *
     * **/
    if (!channelData) {
      await redis.del(postKey);
      return null;
    }

    if (postData) {
      postData.channelId = {
        _id: channelData._id,
        channelName: channelData.channelName,
        channelAvatar: channelData.channelAvatar,
      };
    }

    const {
      isPublished,
      channelId: { _id },
    } = postData as unknown as {
      isPublished: boolean;
      channelId: {
        _id: string;
      };
    };

    if (isPublished || (!isPublished && channelId === _id)) return postData;

    return null;
  }

  const result = await PostServices.findPostByPostId({ postId, channelId });

  if (!result) return result;

  await redis.setex(
    postKey,
    PostConstant.POST_REDIS_TTL,
    JSON.stringify(result),
  );

  return result;
};

const createPost = async ({ payload }: { payload: ICreatePost }) => {
  const result = (await PostServices.createPost({
    payload,
  })) as unknown as TDocumentType<ICreatePost>;

  if (!result) return result;

  const { _id } = result;

  const postKey = RedisKeys.postKey(_id?.toString());

  await redis.setex(
    postKey,
    PostConstant.POST_REDIS_TTL,
    JSON.stringify(result),
  );

  return result;
};

const updatePost = async ({
  payload,
  postId,
}: {
  payload: Partial<ICreatePost>;
  postId: string;
}) => {
  const result = (await PostServices.updatePost({
    payload,
    postId,
  })) as unknown as TDocumentType<ICreatePost>;

  if (!result) return result;

  const postKey = RedisKeys.postKey(postId);

  await redis.setex(
    postKey,
    PostConstant.POST_REDIS_TTL,
    JSON.stringify(result),
  );

  return result;
};

const deletePost = async (postId: string) => {
  const result = await PostServices.deletePost({ postId });

  if (!result) return result;

  const postKey = RedisKeys.postKey(postId);

  await redis.del(postKey);

  return result;
};

export const PostCache = {
  findPostByPostId,
  createPost,
  updatePost,
  deletePost,
};
