import { ICreatePost } from "./post.interface";
import errorHandler from "../../errors/errorHandler";
import { PostModel } from "./post.model";

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
  createPost,
  updatePost,
  deletePost,
};
