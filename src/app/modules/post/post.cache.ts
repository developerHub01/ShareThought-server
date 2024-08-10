import { redis } from "../../../app";
import { TDocumentType } from "../../interface/interface";
import { RedisKeys } from "../../redis.keys";
import { ICreatePost } from "./post.interface";
import { PostServices } from "./post.services";

const findPostByPostId = async (postId: string, channelId: string) => {
  const postKey = RedisKeys.postKey(postId);
  let postData = await redis.get(postKey);

  if (postData) {
    postData = JSON.parse(postData);

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

  const result = await PostServices.findPostByPostId(postId, channelId);

  if (!result) return result;

  await redis.set(postKey, JSON.stringify(result));

  return result;
};

const createPost = async (payload: ICreatePost) => {
  const result = (await PostServices.createPost(
    payload,
  )) as TDocumentType<ICreatePost>;

  if (!result) return result;

  const { _id } = result;

  const postKey = RedisKeys.postKey(_id?.toString());

  await redis.set(postKey, JSON.stringify(result));

  return result;
};

const updatePost = async (payload: Partial<ICreatePost>, postId: string) => {
  const result = (await PostServices.updatePost(
    payload,
    postId,
  )) as TDocumentType<ICreatePost>;

  if (!result) return result;

  const postKey = RedisKeys.postKey(postId);

  await redis.set(postKey, JSON.stringify(result));

  return result;
};

const deletePost = async (postId: string) => {
  const result = await PostServices.deletePost(postId);

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
