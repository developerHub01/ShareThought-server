import httpStatus from "http-status";
import postReactionSchema from "./model.schema";
import AppError from "../../../errors/AppError";

postReactionSchema.pre("save", async function (next) {
  if (!(this.postId || this.communityPostId))
    throw new AppError(httpStatus.BAD_REQUEST, "post id is required");

  if (!this.userId && !this.channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "author data not exist");

  next();
});
