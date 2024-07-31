import { model } from "mongoose";
import { IPostReaction, IPostReactionModel } from "../post.reaction.interface";
import { PostReactionConstant } from "../post.reaction.constant";

/* post reaction schema start ========================= */
import postReactionSchema from "./model.schema";
/* post reaction schema end ========================= */

/* post reaction schema middleware start ========================= */
import "./model.middleware";
/* post reaction schema middleware end ========================= */

/* post reaction schema static methods start ========================= */
import "./model.static.method";
/* post reaction schema static methods end ========================= */

export const PostReactionModel = model<IPostReaction, IPostReactionModel>(
  PostReactionConstant.POST_REACTION_COLLECTION_NAME,
  postReactionSchema,
);
