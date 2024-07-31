import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { TAuthorType, TPostType } from "../../interface/interface";
import { ICreateComment } from "./comment.interface";
import { CommentModel } from "./model/model";

const findCommentByPostId = async (
  query: Record<string, unknown>,
  postId: string,
  postType: TPostType,
) => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const findCommentById = async (commentId: string) => {
  try {
    return await CommentModel.findComment(commentId);
  } catch (error) {
    errorHandler(error);
  }
};

const createComment = async (
  payload: ICreateComment,
  postId: string,
  postType: TPostType,
  authorId: string,
  authorType: TAuthorType,
) => {
  try {
    payload = {
      ...payload,
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(authorType === "channelId"
        ? { commentAuthorChannelId: authorId }
        : { commentAuthorId: authorId }),
    };

    return await CommentModel.createComment(payload);
  } catch (error) {
    errorHandler(error);
  }
};

const replyComment = async (
  payload: ICreateComment,
  parentCommentId: string,
  authorId: string,
  authorType: TAuthorType,
) => {
  try {
    payload = {
      ...payload,
      parentCommentId,
      ...(authorType === "channelId"
        ? { commentAuthorChannelId: authorId }
        : { commentAuthorId: authorId }),
    };

    return await CommentModel.createComment(payload);
  } catch (error) {
    errorHandler(error);
  }
};

const updateComment = async (payload: ICreateComment, commentId: string) => {
  try {
    return await CommentModel.updateComment(payload, commentId);
  } catch (error) {
    errorHandler(error);
  }
};

const deleteComment = async (commentId: string) => {
  try {
    return await CommentModel.deleteComment(commentId);
  } catch (error) {
    errorHandler(error);
  }
};

const deleteAllComment = async (postId: string, postType: TPostType) => {
  try {
    return await CommentModel.deleteAllCommentByPostId(postId, postType);
  } catch (error) {
    errorHandler(error);
  }
};

const removeCommentImageField = async (commentId: string) => {
  try {
    return await CommentModel.findByIdAndUpdate(
      commentId,
      {
        $unset: { commentImage: 1 },
      },
      { new: true },
    );
  } catch (error) {
    errorHandler(error);
  }
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
};
