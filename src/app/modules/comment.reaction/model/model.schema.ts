import { Schema } from "mongoose";
import {
  ICommentReaction,
  ICommentReactionModel,
} from "../comment.reaction.interface";
import { CommentConstant } from "../../comment/comment.constant";
import { UserConstant } from "../../user/user.constant";
import { ChannelConstant } from "../../channel/channel.constant";
import { CommentReactionConstant } from "../comment.reaction.constant";

const commentReactionSchema = new Schema<
  ICommentReaction,
  ICommentReactionModel
>(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: CommentConstant.COMMENT_COLLECTION_NAME,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
    },
    reactionType: {
      type: String,
      enum: Object.values(CommentReactionConstant.COMMENT_REACTION_TYPES),
    },
  },
  {
    versionKey: false,
  },
);

export default commentReactionSchema;
