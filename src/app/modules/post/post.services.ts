import { ICreatePost } from "./post.interface";
import errorHandler from "../../errors/errorHandler";
import { PostModel } from "./post.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { PostConstant } from "./post.constant";
import { ChannelModel } from "../channel/channel.model";

interface IFindPostByIdQuery {
  _id: string;
  isPublished?: boolean;
}

interface IPostByIdQuery {
  isPublished?: boolean;
}

const findPost = async (query: Record<string, unknown>) => {
  try {
    const postQuery = new QueryBuilder(
      PostModel.find({
        isPublished: true,
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
  channelId: string,
  authorId: string,
) => {
  try {
    const searchQuery: IPostByIdQuery = {};

    if (authorId) {
      const isMyChannel = await ChannelModel.isChannelMine(channelId, authorId);

      if (!isMyChannel) query["isPublished"] = true;
    }

    const postQuery = new QueryBuilder(PostModel.find(searchQuery), query)
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
const findPostByPostId = async (postId: string, userId?: string) => {
  try {
    const query: IFindPostByIdQuery = { _id: postId };

    if (userId) {
      const isMyPost = await PostModel.isMyPost(postId, userId);

      if (!isMyPost) query["isPublished"] = true;
    }

    return await PostModel.findOne(query);
  } catch (error) {
    errorHandler(error);
  }
};

const createPost = async (payload: ICreatePost) => {
  // const { tags } = payload;
  // const session = await mongoose.startSession();

  try {
    // session.startTransaction();
    // console.log("=====================");
    // const tagsAdded = await TagModel.addTags(tags, session);
    // console.log({ tagsAdded, channelId });
    // await session.commitTransaction();
    // await session.endSession();

    return await PostModel.create({
      ...payload,
    });
  } catch (error) {
    // await session.abortTransaction();
    // await session.endSession();
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
    /* 
    ================= TODO
    
    here need to use transaction with delete post and delete reaction, comments
    
    */

    return await PostModel.findByIdAndDelete(postId);
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
