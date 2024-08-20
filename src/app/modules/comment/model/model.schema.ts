import { Schema } from "mongoose";
import { IComment, ICommentModel } from "../comment.interface";
import { PostConstant } from "../../post/post.constant";
import { CommunityPostConstant } from "../../community.post/community.post.constant";
import { UserConstant } from "../../user/user.constant";
import { ChannelConstant } from "../../channel/channel.constant";
import { CommentConstant } from "../comment.constant";
// import mongooseAutoComplete from "mongoose-autopopulate";

const commentSchema = new Schema<IComment, ICommentModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
    },
    communityPostId: {
      type: Schema.Types.ObjectId,
      ref: CommunityPostConstant.COMMUNITY_POST_COLLECTION_NAME,
    },
    commentAuthorId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
    commentAuthorChannelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
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
    commentImage: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  },
);

// commentSchema.plugin(mongooseAutoComplete);

commentSchema.virtual("totalRepies").get(function () {
  return this.replies.length;
});

export default commentSchema;
