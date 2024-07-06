import mongoose, { model, Schema } from "mongoose";
import { CommentConstant } from "./comment.constant";
import { PostConstant } from "../post/post.constant";
import { UserConstant } from "../user/user.constant";
import { IComment, ICommentModel, ICreateComment } from "./comment.interface";
import errorHandler from "../../errors/errorHandler";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { PostModel } from "../post/post.model";

const commentSchema = new Schema<IComment, ICommentModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
      required: true,
    },
    commentAuthorId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
      required: true,
    },
    content: {
      type: String,
      maxLen: CommentConstant.COMMENT_CONTENT_MAX_LENGTH,
      minLen: CommentConstant.COMMENT_CONTENT_MIN_LENGTH,
      required: true,
      trim: true,
    },
    replies: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: CommentConstant.COMMENT_COLLECTION_NAME,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

commentSchema.virtual("totalRepies").get(function () {
  return this.replies.length;
});

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

commentSchema.statics.isMyPost = async (
  commentId: string,
  userId: string,
): Promise<boolean | unknown> => {
  try {
    const commentData = await CommentModel.findById(commentId);

    if (!commentData)
      throw new AppError(httpStatus.NOT_FOUND, "post and comment not found");

    return await PostModel.isMyPost(commentData?.postId?.toString(), userId);
  } catch (error) {
    errorHandler(error);
  }
};
commentSchema.statics.isMyComment = async (
  commentId: string,
  userId: string,
): Promise<boolean | unknown> => {
  try {
    const commentData = await CommentModel.findById(commentId);
    if (!commentData)
      throw new AppError(httpStatus.NOT_FOUND, "comment not found");

    return commentData?.commentAuthorId?.toString() === userId;
  } catch (error) {
    errorHandler(error);
  }
};

commentSchema.statics.updateComment = async (
  payload: ICreateComment,
  commentId: string,
  userId: string,
): Promise<unknown> => {
  try {
    const haveUpdateAccess = await CommentModel.isMyComment(commentId, userId);

    if (!haveUpdateAccess)
      throw new AppError(httpStatus.UNAUTHORIZED, "this is not your comment");

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

commentSchema.statics.deleteComment = async (
  id: string,
  userId: string,
): Promise<boolean | unknown> => {
  const haveAccessToDelete =
    (await CommentModel.isMyPost(id, userId)) ||
    (await CommentModel.isMyComment(id, userId));

  if (!haveAccessToDelete)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This comment or post is not your",
    );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let result = Boolean(
      await CommentModel.findByIdAndDelete(id, {
        session,
      }),
    );

    if (!result)
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");

    result = Boolean(
      await CommentModel.updateMany(
        {
          replies: id,
        },
        {
          $pull: { replies: id },
        },
        { session },
      ),
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

export const CommentModel = model<IComment, ICommentModel>(
  CommentConstant.COMMENT_COLLECTION_NAME,
  commentSchema,
);
