import httpStatus from "http-status";
import { ReadLaterModel } from "./model";
import readLaterSchema from "./model.schema";
import AppError from "../../../errors/AppError";
import errorHandler from "../../../errors/errorHandler";

readLaterSchema.pre("save", async function (next) {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
});
