import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { SavedCategoryModel } from "./model";
import savedCategorySchema from "./model.schema";

savedCategorySchema.pre("save", async function (next) {
  if (
    await SavedCategoryModel.findOne({
      userId: this.userId,
      categoryId: this.categoryId,
    })
  )
    throw new AppError(httpStatus.BAD_REQUEST, "This is already in save list");

  next();
});
