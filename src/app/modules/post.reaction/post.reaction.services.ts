import QueryBuilder from "../../builder/QueryBuilder";
import { TAuthorType, TPostType } from "../../interface/interface";
import { PostReactionModel } from "./model/model";
import { TPostReactionType } from "./post.reaction.interface";

const myReactionOnPost = async (
  authorId: string,
  authorType: TAuthorType,
  postId: string,
  postType: TPostType,
) => {
  return await PostReactionModel.myReactionOnPost(
    postId,
    postType,
    authorId,
    authorType,
  );
};

const allReactionOnPost = async (
  query: Record<string, unknown>,
  authorId: string,
  authorType: TAuthorType,
  postId: string,
  postType: TPostType,
) => {
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
};

const reactOnPost = async (
  authorId: string,
  authorType: TAuthorType,
  postId: string,
  postType: TPostType,
  reactionType?: TPostReactionType | undefined,
) => {
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
};

export const PostReactionServices = {
  myReactionOnPost,
  allReactionOnPost,
  reactOnPost,
};
