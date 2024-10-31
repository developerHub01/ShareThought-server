import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { ICreateComment } from "./comment.interface";
import { CommentModel } from "./model/model";
import { TAuthorType, TPostType } from "../../interface/interface";

/**
 * - first check that is that my post if my post means I am the AUTHOR or an MODERATOR
 * - if my post then only I can show the hidden comments
 * - also maintain pin and hidden properties for query parameters
 * - if I am not channel author or moderator then then I can't use query params on isHidden
 * - and we are finding those comments which are not pinned
 * - after finding regular comments now check that is it first first page query? if then find all pinned comments
 * - after finding pinned comments then merge them into an single array of comments
 * - and also update comments count by adding pinned comments number with other comments count
 * **/
const findCommentByPostId = async ({
  query,
  postId,
  postType,
  isMyPost,
}: {
  query: Record<string, unknown>;
  postId: string;
  postType: TPostType;
  isMyPost: boolean;
}) => {
  let showHiddenComments = false;

  if (isMyPost) showHiddenComments = true;

  if (query["isHidden"]) delete query["isHidden"];

  const commentQuery = new QueryBuilder(
    CommentModel.find({
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(showHiddenComments ? {} : { isHidden: false }),
      isPinned: false,
      parentCommentId: { $exists: false },
    }).populate({
      path: "commentAuthorId",
      select: "fullName avatar",
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await commentQuery.countTotal();
  let result = await commentQuery.modelQuery;

  if (!query.page || Number(query.page) <= 1) {
    const pinnedComments = await CommentModel.find({
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(showHiddenComments ? {} : { isHidden: false }),
      isPinned: true,
      parentCommentId: { $exists: false },
    }).populate({
      path: "commentAuthorId",
      select: "fullName avatar",
    });

    result = [...pinnedComments, ...result];

    meta.total = meta.total + pinnedComments.length;
  }

  return {
    meta,
    result,
  };
};

/**
 * - first find the comment
 * - if comment not found then return null
 * - if I am not the AUTHOR or MODERATOR of comment channel and comment is hidden then also return null
 * - else return comment
 * **/
const findCommentById = async ({
  commentId,
  activeChannelId,
}: {
  commentId: string;
  activeChannelId: string;
}) => {
  const commentData = await CommentModel.findById(commentId).populate({
    path: "commentAuthorId",
    select: "fullName avatar",
  });

  if (
    !commentData ||
    (commentData.commentAuthorChannelId?.toString() !== activeChannelId &&
      commentData.isHidden)
  )
    return null;

  return commentData;
};

const createComment = async ({
  payload,
  postId,
  postType,
  authorId,
  authorType,
}: {
  payload: ICreateComment;
  postId: string;
  postType: TPostType;
  authorId: string;
  authorType: TAuthorType;
}) => {
  payload = {
    ...payload,
    ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
    ...(authorType === "channelId"
      ? { commentAuthorChannelId: authorId }
      : { commentAuthorId: authorId }),
  };

  return await CommentModel.createComment({ payload });
};

const replyComment = async ({
  payload,
  parentCommentId,
  authorId,
  authorType,
}: {
  payload: ICreateComment;
  parentCommentId: string;
  authorId: string;
  authorType: TAuthorType;
}) => {
  payload = {
    ...payload,
    parentCommentId,
    ...(authorType === "channelId"
      ? { commentAuthorChannelId: authorId }
      : { commentAuthorId: authorId }),
  };

  return await CommentModel.createComment({ payload });
};

const updateComment = async ({
  payload,
  commentId,
}: {
  payload: ICreateComment;
  commentId: string;
}) => {
  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      ...payload,
    },
    { new: true },
  );
};

const deleteComment = async ({ commentId }: { commentId: string }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await CommentModel.deleteCommentsWithReplies(
      commentId,
      session,
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const deleteAllComment = async ({
  postId,
  postType,
}: {
  postId: string;
  postType: TPostType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await CommentModel.find(
      postType === "blogPost" ? { postId } : { communityPostId: postId },
    ).select("_id");

    for (const commentData of result) {
      const { _id } = commentData;
      await CommentModel.deleteCommentsWithReplies({
        commentId: _id?.toString(),
        session,
      });
    }
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const removeCommentImageField = async ({
  commentId,
}: {
  commentId: string;
}) => {
  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      $unset: { commentImage: 1 },
    },
    { new: true },
  );
};

const togglePinComment = async ({ commentId }: { commentId: string }) => {
  /* used aggregation to make that change in single query */
  return await CommentModel.findByIdAndUpdate(
    commentId,
    [
      {
        $set: {
          isPinned: {
            $cond: {
              if: {
                $eq: ["$isPinned", true],
              },
              then: false,
              else: true,
            },
          },
        },
      },
    ],
    { new: true },
  );
};

const toggleVisibility = async ({ commentId }: { commentId: string }) => {
  return await CommentModel.findByIdAndUpdate(
    commentId,
    [
      {
        $set: {
          isHidden: {
            $cond: {
              if: {
                $eq: ["$isHidden", true],
              },
              then: false,
              else: true,
            },
          },
        },
      },
    ],
    { new: true },
  );
};

export const CommentServices = {
  findCommentByPostId,
  findCommentById,
  replyComment,
  createComment,
  updateComment,
  deleteComment,
  deleteAllComment,
  removeCommentImageField,
  togglePinComment,
  toggleVisibility,
};
