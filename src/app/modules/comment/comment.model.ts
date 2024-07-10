import mongoose, { ClientSession, model, Schema } from "mongoose";
import { CommentConstant } from "./comment.constant";
import { PostConstant } from "../post/post.constant";
import { UserConstant } from "../user/user.constant";
import { IComment, ICommentModel, ICreateComment } from "./comment.interface";
import errorHandler from "../../errors/errorHandler";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { PostModel } from "../post/post.model";
import { Types } from "mongoose";
import { CommentReactionModel } from "../comment.reaction/comment.reaction.model";
// import mongooseAutoComplete from "mongoose-autopopulate";

const commentSchema = new Schema<IComment, ICommentModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
    },
    commentAuthorId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: CommentConstant.COMMENT_COLLECTION_NAME,
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
          // autopopulate: true,
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

// commentSchema.plugin(mongooseAutoComplete);

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

commentSchema.statics.createComment = async (
  payload: ICreateComment,
): Promise<unknown> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { parentCommentId, postId } = payload;

    if (
      postId &&
      !(await PostModel.findOne({ _id: postId, isPublished: true }))
    )
      throw new AppError(httpStatus.NOT_FOUND, "post not found");

    if (parentCommentId && !(await CommentModel.findById(parentCommentId)))
      throw new AppError(httpStatus.NOT_FOUND, "comment not found");

    await session.commitTransaction();

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

    await session.endSession();

    return addToParentDoc;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return errorHandler(error);
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

commentSchema.statics.deleteCommentsWithReplies = async (
  commentId: string,
  session?: ClientSession,
) => {
  const options = session ? { session } : {};
  const commentData = await CommentModel.findById(commentId, null, options);
  if (!commentData)
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

  const { replies } = commentData;

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
  return await CommentModel.findByIdAndDelete(commentId, options?.session);
};

commentSchema.statics.deleteComment = async (
  commentId: string,
  userId: string,
): Promise<boolean | unknown> => {
  const haveAccessToDelete =
    (await CommentModel.isMyPost(commentId, userId)) ||
    (await CommentModel.isMyComment(commentId, userId));

  if (!haveAccessToDelete)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "This comment or post is not your",
    );

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
  userId: string,
): Promise<unknown> => {
  console.log({ postId, userId });
  console.log("============+++++++=============");

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!(await PostModel.isMyPost(postId, userId)))
      throw new AppError(httpStatus.UNAUTHORIZED, "This is not your post");

    const result = await CommentModel.find({
      postId,
    }).select("_id");

    for (const test of result) {
      console.log(test);
      const { _id } = test;
      console.log({ _id });
      console.log(_id.toString());
      console.log("============#######=============");
      await CommentModel.deleteCommentsWithReplies(_id?.toString(), session);
    }
    await session.commitTransaction();
    await session.endSession();

    console.log(result);

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return errorHandler(error);
  }
};

export const CommentModel = model<IComment, ICommentModel>(
  CommentConstant.COMMENT_COLLECTION_NAME,
  commentSchema,
);
