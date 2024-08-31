import { ICreatePost } from "./post.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { PostConstant } from "./post.constant";
import { PostModel } from "./model/model";

interface IFindPostByIdQuery {
  _id: string;
  isPublished?: boolean;
}

const findPost = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    PostModel.find({
      isPublished: true,
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .search(PostConstant.POST_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.modelQuery;

  return {
    meta,
    result,
  };
};

/****
 *
 * If any post is panding and I am the author of the channel then only I can see and hide from others
 * If any post is published then anyone can read post
 *
 */
const findPostByChannelId = async (
  query: Record<string, unknown>,
  id: string,
  channelId: string,
) => {
  const postQuery = new QueryBuilder(
    PostModel.find({
      channelId: id,
      ...(id === channelId ? {} : { isPublished: true }),
    }).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    }),
    query,
  )
    .search(PostConstant.POST_SEARCHABLE_FIELD)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.modelQuery;

  return {
    meta,
    result,
  };
};

/****
 *
 * If post is panding and I am the author then only I can see and hide from others
 * If post is published then anyone can read post
 *
 */
const findPostByPostId = async (postId: string, channelId?: string) => {
  const query: IFindPostByIdQuery = { _id: postId };

  if (channelId) {
    const isMyPost = await PostModel.isMyPost(postId, channelId);

    if (!isMyPost) query["isPublished"] = true;
  }

  return await PostModel.findOne(query).populate({
    path: "channelId",
    select: "channelName channelAvatar",
  });
};

const createPost = async (payload: ICreatePost) => {
  return await PostModel.createPost(payload);
};

const updatePost = async (payload: Partial<ICreatePost>, postId: string) => {
  return await PostModel.updatePost(payload, postId);
};

const deletePost = async (postId: string) => {
  return await PostModel.deletePost(postId);
};

export const PostServices = {
  findPost,
  findPostByChannelId,
  findPostByPostId,
  createPost,
  updatePost,
  deletePost,
};
