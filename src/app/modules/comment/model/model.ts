import { model } from "mongoose";
import { CommentConstant } from "../comment.constant";
import { IComment, ICommentModel } from "../comment.interface";

/* comment schema start ===================== */
import commentSchema from "./model.schema";
/* comment schema end ===================== */

/* comment schema middleware start ===================== */
import "./model.middleware";
/* comment schema middleware end ===================== */

/* comment schema static methods start ===================== */
import "./model.static.method";
/* comment schema static methods end ===================== */

export const CommentModel = model<IComment, ICommentModel>(
  CommentConstant.COMMENT_COLLECTION_NAME,
  commentSchema,
);
