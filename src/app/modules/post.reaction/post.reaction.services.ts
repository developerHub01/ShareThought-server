import QueryBuilder from "../../builder/QueryBuilder";
import { TAuthorType, TPostType } from "../../interface/interface";
import { PostReactionModel } from "./model/model";
import { TPostReactionType } from "./post.reaction.interface";

const myReactionOnPost = async ({
  authorId,
  authorIdType,
  postId,
  postType,
}: {
  authorId: string;
  authorIdType: TAuthorType;
  postId: string;
  postType: TPostType;
}) => {
  return await PostReactionModel.myReactionOnPost({
    postId,
    postType,
    authorId,
    authorIdType,
  });
};

const allReactionOnPost = async ({
  query,
  authorId,
  authorIdType,
  postId,
  postType,
}: {
  query: Record<string, unknown>;
  authorId: string;
  authorIdType: TAuthorType;
  postId: string;
  postType: TPostType;
}) => {
  const postReactionQuery = new QueryBuilder(
    PostReactionModel.find({
      ...(authorIdType === "channelId"
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

const reactOnPost = async ({
  authorId,
  authorIdType,
  postId,
  postType,
  reactionType,
}: {
  authorId: string;
  authorIdType: TAuthorType;
  postId: string;
  postType: TPostType;
  reactionType?: TPostReactionType;
}) => {
  if (reactionType)
    return await PostReactionModel.reactOnPost({
      postId,
      postType,
      authorId,
      authorIdType,
      reactionType,
    });

  return await PostReactionModel.togglePostReaction({
    postId,
    postType,
    authorId,
    authorIdType,
  });
};

export const PostReactionServices = {
  myReactionOnPost,
  allReactionOnPost,
  reactOnPost,
};
