import { model } from "mongoose";
import {
  ICommentReaction,
  ICommentReactionModel,
} from "../comment.reaction.interface";
import { CommentReactionConstant } from "../comment.reaction.constant";

/* comment reaction schema start ================ */
import commentReactionSchema from "./model.schema";
/* comment reaction schema end ================ */

/* comment reaction schema middleware start ================ */
import "./model.middleware";
/* comment reaction schema middleware end ================ */

/* comment reaction schema static method start ================ */
import "./model.static.method";
/* comment reaction schema static method end ================ */

export const CommentReactionModel = model<
  ICommentReaction,
  ICommentReactionModel
>(
  CommentReactionConstant.COMMENT_REACTION_COLLECTION_NAME,
  commentReactionSchema,
);
