import httpStatus from "http-status";
import commentSchema from "./model.schema";
import AppError from "../../../errors/AppError";

commentSchema.pre("save", async function (next) {
  if (!this.postId && !this.communityPostId)
    throw new AppError(httpStatus.BAD_REQUEST, "post id is required");

  if (!this.commentAuthorId && !this.commentAuthorChannelId)
    throw new AppError(httpStatus.BAD_REQUEST, "comment author data not exist");

  return next();
});
