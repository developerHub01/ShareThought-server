import { Schema } from "mongoose";
import { IReport, IReportModel } from "../report.interface";
import { ReportConstant } from "../report.constant";
import { UserConstant } from "../../user/user.constant";
import { ChannelConstant } from "../../channel/channel.constant";
import { PostConstant } from "../../post/post.constant";
import { CommentConstant } from "../../comment/comment.constant";
import { CommunityPostConstant } from "../../community.post/community.post.constant";

const reportSchema = new Schema<IReport, IReportModel>(
  {
    reportType: {
      type: String,
      enum: Object.values(Object.keys(ReportConstant.REPORT_TYPES)),
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
    authorIdType: {
      type: String,
      enum: ["channelId", "userId"],
      default: "userId",
    },
    contextChannel: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
    },
    contextBlogPost: {
      type: Schema.Types.ObjectId,
      ref: PostConstant.POST_COLLECTION_NAME,
    },
    contextCommunityPost: {
      type: Schema.Types.ObjectId,
      ref: CommunityPostConstant.COMMUNITY_POST_COLLECTION_NAME,
    },
    contextComment: {
      type: Schema.Types.ObjectId,
      ref: CommentConstant.COMMENT_COLLECTION_NAME,
    },
    reportContextType: {
      type: String,
      enum: Object.values(Object.keys(ReportConstant.REPORT_CONTEXT_TYPES)),
      required: true,
    },
    content: {
      type: String,
    },
    evidenceImages: {
      type: [String],
      default: [],
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    responseType: {
      type: String,
      enum: Object.values(Object.keys(ReportConstant.REPORT_RESPONSE_TYPES)),
      default: ReportConstant.REPORT_RESPONSE_TYPES.PENDING,
    },
  },
  {
    versionKey: false,
  },
);

export default reportSchema;
