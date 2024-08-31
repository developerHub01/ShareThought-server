import httpStatus from "http-status";
import { ReadLaterModel } from "./model";
import readLaterSchema from "./model.schema";
import AppError from "../../../errors/AppError";

readLaterSchema.pre("save", async function (next) {
  if (
    await ReadLaterModel.findOne({
      postId: this?.postId,
      userId: this?.userId,
    })
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This is already in read later list",
    );
  }

  return next();
});
