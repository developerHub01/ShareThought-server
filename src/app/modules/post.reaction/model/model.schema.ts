import { Schema } from "mongoose";
import { IPostReaction, IPostReactionModel } from "../post.reaction.interface";
import { PostConstant } from "../../post/post.constant";
import { CommunityPostConstant } from "../../community.post/community.post.constant";
import { UserConstant } from "../../user/user.constant";
import { ChannelConstant } from "../../channel/channel.constant";
import { PostReactionConstant } from "../post.reaction.constant";

const postReactionSchema = new Schema<IPostReaction, IPostReactionModel>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: PostConstant.POST_COLLECTION_NAME,
  },
  communityPostId: {
    type: Schema.Types.ObjectId,
    ref: CommunityPostConstant.COMMUNITY_POST_COLLECTION_NAME,
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
    enum: Object.values(PostReactionConstant.POST_REACTION_TYPES),
  },
});

export default postReactionSchema;
