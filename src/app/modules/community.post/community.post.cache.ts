import { redis } from "../../../app";
import { TDocumentType } from "../../interface/interface";
import { RedisKeys } from "../../redis.keys";
import {
  ICommunityPost,
  ICreateCommunityPost,
} from "./community.post.interface";
import { CommunityPostServices } from "./community.post.services";

const findCommuityPostById = async (id: string, channelId: string) => {
  const postKey = RedisKeys.communityPostkey(id);
  let postData = await redis.get(postKey);

  if (postData) {
    postData = JSON.parse(postData);
    const { isPublished, channelId: _id } =
      postData as unknown as ICommunityPost;

    if (isPublished || _id.toString() === channelId) return postData;

    return null;
  }

  const result = await CommunityPostServices.findCommuityPostById(
    id,
    channelId,
  );

  if (!result) return result;

  await redis.set(postKey, JSON.stringify(result));

  return result;
};

const createPost = async (payload: ICreateCommunityPost) => {
  const result = (await CommunityPostServices.createPost(
    payload,
  )) as TDocumentType<ICreateCommunityPost>;

  if (!result) return result;

  const { _id } = result;

  const postKey = RedisKeys.communityPostkey(_id?.toString());

  await redis.set(postKey, JSON.stringify(result));

  return result;
};

const updatePost = async (payload: ICreateCommunityPost, id: string) => {
  const result = (await CommunityPostServices.updatePost(
    payload,
    id,
  )) as TDocumentType<ICreateCommunityPost>;

  if (!result) return result;

  const { _id } = result;

  const postKey = RedisKeys.communityPostkey(_id?.toString());

  await redis.set(postKey, JSON.stringify(result));

  return result;
};

const deletePost = async (id: string) => {
  const result = await CommunityPostServices.deletePost(id);

  if (!result) return result;

  const postKey = RedisKeys.communityPostkey(id);

  await redis.del(postKey);

  return result;
};

export const CommunityPostCache = {
  findCommuityPostById,
  createPost,
  updatePost,
  deletePost,
};
