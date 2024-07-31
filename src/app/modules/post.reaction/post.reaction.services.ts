import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { TAuthorType, TPostType } from "../../interface/interface";
import { PostReactionModel } from "./model/model";
import { TPostReactionType} from "./post.reaction.interface";

const myReactionOnPost = async (
  authorId: string,
  authorType: TAuthorType,
  postId: string,
  postType: TPostType,
) => {
  try {
    return await PostReactionModel.myReactionOnPost(
      postId,
      postType,
      authorId,
      authorType,
    );
  } catch (error) {
    errorHandler(error);
  }
};

const allReactionOnPost = async (
  query: Record<string, unknown>,
  authorId: string,
  authorType: TAuthorType,
  postId: string,
  postType: TPostType,
) => {
  try {
    const postReactionQuery = new QueryBuilder(
      PostReactionModel.find({
        ...(authorType === "channelId"
          ? { channelId: authorId }
          : { userId: authorId }),
        ...(postType === "blogPost"
          ? { postId: postId }
          : { communityPostId: postId }),
      })
        .populate({
          path: "userId",
          select: "fullName avatar",
        })
        .populate({
          path: "channelId",
          select: "channelName channelAvatar",
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
};

const reactOnPost = async (
  authorId: string,
  authorType: TAuthorType,
  postId: string,
  postType: TPostType,
  reactionType?: TPostReactionType | undefined,
) => {
  try {
    if (reactionType)
      return await PostReactionModel.reactOnPost(
        postId,
        postType,
        authorId,
        authorType,
        reactionType,
      );

    return await PostReactionModel.togglePostReaction(
      postId,
      postType,
      authorId,
      authorType,
    );
  } catch (error) {
    errorHandler(error);
  }
};

export const PostReactionServices = {
  myReactionOnPost,
  allReactionOnPost,
  reactOnPost,
};
