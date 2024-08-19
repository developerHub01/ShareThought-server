import httpStatus from "http-status";
import { CommentModel } from "./model";
import commentSchema from "./model.schema";
import mongoose, { ClientSession, Types } from "mongoose";
import errorHandler from "../../../errors/errorHandler";
import AppError from "../../../errors/AppError";
import { TAuthorType, TPostType } from "../../../interface/interface";
import { ICreateComment } from "../comment.interface";
import { CommentReactionModel } from "../../comment.reaction/model/model";
import { CloudinaryUtils } from "../../../utils/cloudinary.utils";
import { CommunityPostModel } from "../../community.post/model/model";
import { PostModel } from "../../post/model/model";

commentSchema.statics.findComment = async (id: string): Promise<unknown> => {
  try {
    return await CommentModel.findById(id).populate({
      path: "commentAuthorId",
      select: "fullName avatar",
    });
  } catch (error) {
    errorHandler(error);
  }
};

commentSchema.statics.isCommentOfMyAnyChannel = async (
  userId: string,
  commentId: string,
): Promise<unknown> => {
  // const commentData = await CommentModel.findById(commentId);

  const commentData = await CommentModel.findById(
    commentId,
    "commentAuthorId commentAuthorChannelId",
  ).populate({
    path: "commentAuthorChannelId",
    select: "authorId",
  });

  if (!commentData)
    throw new AppError(httpStatus.NOT_FOUND, "comment not found");

  const { commentAuthorId, commentAuthorChannelId } = commentData;

  if (commentAuthorId) return commentAuthorId?.toString() === userId;

  const { authorId } = commentAuthorChannelId as unknown as {
    authorId: Types.ObjectId;
  };

  if (authorId) return authorId?.toString() === userId;

  return false;
};

commentSchema.statics.isMyPost = async (
  commentId: string,
  userId: string,
): Promise<boolean | unknown> => {
  try {
    let { postId, communityPostId } =
      (await CommentModel.findById(commentId)) || {};

    (postId as string | undefined) = postId?.toString();
    (communityPostId as string | undefined) = communityPostId?.toString();

    const id = postId || communityPostId;
    if (!id)
      throw new AppError(httpStatus.NOT_FOUND, "post and comment not found");

    return await PostModel.isMyPost(id as unknown as string, userId);
  } catch (error) {
    errorHandler(error);
  }
};

commentSchema.statics.isMyComment = async (
  commentId: string,
  authorId: string,
  authorType: TAuthorType,
): Promise<boolean | unknown> => {
  try {
    const commentData = await CommentModel.findById(commentId);
    if (!commentData)
      throw new AppError(httpStatus.NOT_FOUND, "comment not found");

    return (
      (authorType === "userId"
        ? commentData?.commentAuthorId?.toString()
        : commentData?.commentAuthorChannelId?.toString()) === authorId
    );
  } catch (error) {
    errorHandler(error);
  }
};

commentSchema.statics.haveAccessToDelete = async (
  commentId: string,
  authorId: string,
  authorType: TAuthorType,
): Promise<unknown> => {
  try {
    const commentData = await CommentModel.findById(commentId);

    if (!commentData)
      throw new AppError(httpStatus.NOT_FOUND, "comment not found");

    const { commentAuthorId, commentAuthorChannelId } = commentData;

    return (
      (authorType === "channelId"
        ? commentAuthorChannelId?.toString()
        : commentAuthorId?.toString()) === authorId
    );
  } catch (error) {
    return errorHandler(error);
  }
};

commentSchema.statics.createComment = async (
  payload: ICreateComment,
): Promise<unknown> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parentCommentId = payload.parentCommentId;
    let { postId, communityPostId } = payload;

    if (
      (postId &&
        !(await PostModel.findOne({ _id: postId, isPublished: true }))) ||
      (communityPostId &&
        !(await CommunityPostModel.findOne({
          _id: communityPostId,
          isPublished: true,
        })))
    )
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    /* if it is a reply */
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);

      if (!parentComment)
        throw new AppError(httpStatus.NOT_FOUND, "comment not found");

      let idDetails: Record<string, unknown> = {};
      if (!postId) {
        postId = parentComment?.postId?.toString();

        idDetails = {
          ...idDetails,
          postId,
        };
      } else if (!communityPostId) {
        communityPostId = parentComment?.communityPostId?.toString();
        idDetails = {
          ...idDetails,
          communityPostId,
        };
      }
      payload = {
        ...payload,
        ...idDetails,
      };
    }

    const commentData = (
      await CommentModel.create(
        [
          {
            ...payload,
          },
        ],
        {
          session,
        },
      )
    )[0];

    if (!commentData)
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Comment not created something went wrong",
      );

    const { _id: commentId } = commentData as typeof commentData & {
      _id: Types.ObjectId;
    };

    if (!parentCommentId) {
      await session.commitTransaction();
      await session.endSession();
      return commentData;
    }

    const addToParentDoc = await CommentModel.findByIdAndUpdate(
      parentCommentId,
      {
        $push: {
          replies: commentId,
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!addToParentDoc)
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Comment not created something went wrong",
      );

    await session.commitTransaction();
    await session.endSession();

    return addToParentDoc;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return errorHandler(error);
  }
};

commentSchema.statics.updateComment = async (
  payload: Partial<ICreateComment>,
  commentId: string,
): Promise<unknown> => {
  try {
    return await CommentModel.findByIdAndUpdate(
      commentId,
      {
        ...payload,
      },
      { new: true },
    );
  } catch (error) {
    errorHandler(error);
  }
};

commentSchema.statics.deleteCommentsWithReplies = async (
  commentId: string,
  session?: ClientSession,
) => {
  const options = session ? { session } : {};
  const commentData = await CommentModel.findById(commentId, null, options);
  if (!commentData)
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

  const { replies, commentImage } = commentData;

  if (!replies.length) {
    await CommentReactionModel.deleteCommentReactionByCommentId(
      commentId,
      options?.session,
    );
    return await CommentModel.findByIdAndDelete(commentId, options?.session);
  }

  for (const reply of replies) {
    const { _id } = reply;
    await CommentModel.deleteCommentsWithReplies(
      _id?.toString(),
      options?.session,
    );
  }

  await CommentReactionModel.deleteCommentReactionByCommentId(
    commentId,
    options?.session,
  );

  const result = await CommentModel.findByIdAndDelete(
    commentId,
    options?.session,
  );

  if (result && commentImage) await CloudinaryUtils.deleteFile([commentImage]);

  return result;
};

commentSchema.statics.deleteComment = async (
  commentId: string,
): Promise<boolean | unknown> => {
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
    errorHandler(error);
  }
};

commentSchema.statics.deleteAllCommentByPostId = async (
  postId: string,
  postType: TPostType,
): Promise<unknown> => {
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
    return errorHandler(error);
  }
};
