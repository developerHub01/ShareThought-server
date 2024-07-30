import { model } from "mongoose";
import {
  ICommunityPost,
  ICommunityPostModel,
} from "./community.post.interface";
import { CommunityPostConstant } from "./community.post.constant";

// /* shcmea start ============================================= */
import { communityPostSchema } from "./community.post.model.schema";
// /* shcmea end ============================================= */


// /* shcmea middleware start ============================================= */
import "./community.post.model.middleware";
// /* shcmea middleware end ============================================= */


// /* static methods start ============================================= */
import "./community.post.model.static.method";
/* static methods end ============================================= */

export const CommunityPostModel = model<ICommunityPost, ICommunityPostModel>(
  CommunityPostConstant.COMMUNITY_POST_COLLECTION_NAME,
  communityPostSchema,
);
