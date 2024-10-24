import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { TAuthorType, TPostType } from "../../interface/interface";
import { ICreateComment } from "./comment.interface";
import { CommentModel } from "./model/model";

const findCommentByPostId = async (
  query: Record<string, unknown>,
  postId: string,
  postType: TPostType,
) => {
  const commentQuery = new QueryBuilder(
    CommentModel.find({
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
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
  const result = await commentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const findCommentById = async (commentId: string) => {
  return await CommentModel.findById(commentId).populate({
    path: "commentAuthorId",
    select: "fullName avatar",
  });
};

const createComment = async (
  payload: ICreateComment,
  postId: string,
  postType: TPostType,
  authorId: string,
  authorType: TAuthorType,
) => {
  payload = {
    ...payload,
    ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
    ...(authorType === "channelId"
      ? { commentAuthorChannelId: authorId }
      : { commentAuthorId: authorId }),
  };

  return await CommentModel.createComment(payload);
};

const replyComment = async (
  payload: ICreateComment,
  parentCommentId: string,
  authorId: string,
  authorType: TAuthorType,
) => {
  payload = {
    ...payload,
    parentCommentId,
    ...(authorType === "channelId"
      ? { commentAuthorChannelId: authorId }
      : { commentAuthorId: authorId }),
  };

  return await CommentModel.createComment(payload);
};

const updateComment = async (payload: ICreateComment, commentId: string) => {
  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      ...payload,
    },
    { new: true },
  );
};

const deleteComment = async (commentId: string) => {
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

const deleteAllComment = async (postId: string, postType: TPostType) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await CommentModel.find(
      postType === "blogPost" ? { postId } : { communityPostId: postId },
    ).select("_id");

    for (const commentData of result) {
      const { _id } = commentData;
      await CommentModel.deleteCommentsWithReplies(_id?.toString(), session);
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

const removeCommentImageField = async (commentId: string) => {
  return await CommentModel.findByIdAndUpdate(
    commentId,
    {
      $unset: { commentImage: 1 },
    },
    { new: true },
  );
};

const togglePinComment = async (commentId: string) => {
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

const toggleVisibility = async (commentId: string) => {
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
