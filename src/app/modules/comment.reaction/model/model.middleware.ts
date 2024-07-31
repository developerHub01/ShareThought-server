import httpStatus from "http-status";
import commentReactionSchema from "./model.schema";
import AppError from "../../../errors/AppError";

commentReactionSchema.pre("save", async function (next) {
  if (!this.userId && !this.channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "author data not exist");

  next();
});
