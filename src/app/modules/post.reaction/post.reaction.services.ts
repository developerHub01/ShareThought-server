import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { TPostReactionType } from "./post.reaction.interface";
import { PostReactionModel } from "./post.reaction.model";

const myReactionOnPost = async (userId: string, postId: string) => {
  try {
    return await PostReactionModel.myReactionOnPost(userId, postId);
  } catch (error) {
    errorHandler(error);
  }
};

const allReactionOnPost = async (
  query: Record<string, unknown>,
  userId: string,
  postId: string,
) => {
  try {
    try {
      const postReactionQuery = new QueryBuilder(
        PostReactionModel.find({
          userId,
          postId,
        }),
        query,
      )
        .filter()
        .sort()
        .paginate()
        .fields();

      const meta = await postReactionQuery.countTotal();
      const result = await postReactionQuery.modelQuery;

      return {
        meta,
        result,
      };
    } catch (error) {
      errorHandler(error);
    }
  } catch (error) {
    errorHandler(error);
  }
};

const reactOnPost = async (
  userId: string,
  postId: string,
  reactionType: TPostReactionType,
) => {
  try {
    return await PostReactionModel.reactOnPost(userId, postId, reactionType);
  } catch (error) {
    errorHandler(error);
  }
};

export const PostReactionServices = {
  myReactionOnPost,
  allReactionOnPost,
  reactOnPost,
};
