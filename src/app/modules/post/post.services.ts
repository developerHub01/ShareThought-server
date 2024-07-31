import { ICreatePost } from "./post.interface";
import errorHandler from "../../errors/errorHandler";
import QueryBuilder from "../../builder/QueryBuilder";
import { PostConstant } from "./post.constant";
import { PostModel } from "./model/model";

interface IFindPostByIdQuery {
  _id: string;
  isPublished?: boolean;
}

const findPost = async (query: Record<string, unknown>) => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
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
  try {
    const postQuery = new QueryBuilder(
      PostModel.find({
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
  } catch (error) {
    errorHandler(error);
  }
};

/****
 *
 * If post is panding and I am the author then only I can see and hide from others
 * If post is published then anyone can read post
 *
 */
const findPostByPostId = async (postId: string, channelId?: string) => {
  try {
    const query: IFindPostByIdQuery = { _id: postId };

    if (channelId) {
      const isMyPost = await PostModel.isMyPost(postId, channelId);

      if (!isMyPost) query["isPublished"] = true;
    }

    return await PostModel.findOne(query).populate({
      path: "channelId",
      select: "channelName channelAvatar",
    });
  } catch (error) {
    errorHandler(error);
  }
};

const createPost = async (payload: ICreatePost) => {
  try {
    return await PostModel.create({
      ...payload,
    });
  } catch (error) {
    errorHandler(error);
  }
};

const updatePost = async (payload: Partial<ICreatePost>, postId: string) => {
  try {
    return await PostModel.findByIdAndUpdate(
      postId,
      { ...payload },
      { new: true },
    );
  } catch (error) {
    errorHandler(error);
  }
};

const deletePost = async (postId: string) => {
  try {
    return await PostModel.deletePost(postId);
  } catch (error) {
    errorHandler(error);
  }
};

export const PostServices = {
  findPost,
  findPostByChannelId,
  findPostByPostId,
  createPost,
  updatePost,
  deletePost,
};
