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
        }).populate({
          path: "userId",
          select: "fullName avatar",
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
  reactionType?: TPostReactionType | undefined,
) => {
  try {
    if (reactionType)
      return await PostReactionModel.reactOnPost(userId, postId, reactionType);

    return await PostReactionModel.togglePostReaction(userId, postId);
  } catch (error) {
    errorHandler(error);
  }
};

export const PostReactionServices = {
  myReactionOnPost,
  allReactionOnPost,
  reactOnPost,
};
