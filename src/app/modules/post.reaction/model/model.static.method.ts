import { ClientSession } from "mongoose";
import { PostReactionModel } from "./model";
import postReactionSchema from "./model.schema";
import { TAuthorType, TPostType } from "../../../interface/interface";
import errorHandler from "../../../errors/errorHandler";
import { PostReactionConstant } from "../post.reaction.constant";
import { TPostReactionType } from "../post.reaction.interface";

postReactionSchema.statics.totalPostReactionByPostId = async (
  postId: string,
  postType: TPostType,
): Promise<unknown> => {
  try {
    return (
      (await PostReactionModel.countDocuments({
        ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      })) || 0
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.myReactionOnPost = async (
  postId: string,
  postType: TPostType,
  authorId: string,
  authorIdType: TAuthorType,
): Promise<string | unknown> => {
  try {
    const result = await PostReactionModel.findOne({
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
    });

    return result?.reactionType || null;
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.togglePostReaction = async (
  postId: string,
  postType: TPostType,
  authorId: string,
  authorIdType: TAuthorType,
): Promise<boolean | unknown> => {
  try {
    const query = {
      ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      ...(authorIdType === "channelId"
        ? { channelId: authorId }
        : { userId: authorId }),
    };
    const isDeleted = await PostReactionModel.findOneAndDelete(query);

    if (isDeleted) return Boolean(isDeleted);

    return Boolean(
      await PostReactionModel.create({
        ...query,
        reactionType: PostReactionConstant.POST_REACTION_TYPES.LIKE,
      }),
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.reactOnPost = async (
  postId: string,
  postType: TPostType,
  authorId: string,
  authorIdType: TAuthorType,
  reactionType: TPostReactionType,
): Promise<unknown> => {
  try {
    const doc = await PostReactionModel.findOneAndUpdate(
      {
        ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
        ...(authorIdType === "channelId"
          ? { channelId: authorId }
          : { userId: authorId }),
      },
      { upsert: true, new: true },
    );

    return await PostReactionModel.findByIdAndUpdate(
      doc?._id,
      {
        reactionType,
      },
      {
        new: true,
      },
    );
  } catch (error) {
    errorHandler(error);
  }
};

postReactionSchema.statics.deleteAllReactionByPostId = async (
  postId: string,
  postType: TPostType,
  session?: ClientSession,
) => {
  const options = session ? { session } : {};
  try {
    return await PostReactionModel.deleteMany(
      {
        ...(postType === "blogPost" ? { postId } : { communityPostId: postId }),
      },
      options,
    );
  } catch (error) {
    return errorHandler(error);
  }
};
