import { model, Schema } from "mongoose";
import {
  ISavedCategory,
  ISavedCategoryModel,
} from "./saved.category.interface";
import { SavedCategoryConstant } from "./saved.category.constant";
import { UserConstant } from "../user/user.constant";
import { CategoryConstant } from "../category/category.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import errorHandler from "../../errors/errorHandler";

const savedCategorySchema = new Schema<ISavedCategory, ISavedCategoryModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: CategoryConstant.CATEGORY_COLLECTION_NAME,
    },
  },
  {
    timestamps: true,
  },
);

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

savedCategorySchema.statics.addToSaveCategory = async (
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  try {
    return await SavedCategoryModel.create({
      categoryId,
      userId,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

savedCategorySchema.statics.removeFromSaveCategoryByCategoryId = async (
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  try {
    return await SavedCategoryModel.deleteOne({
      categoryId,
      userId,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

savedCategorySchema.statics.removeFromSaveCategoryBySavedCategoryId = async (
  id: string,
  userId: string,
): Promise<unknown> => {
  try {
    const categoryData = await SavedCategoryModel.findById(id);

    if (!categoryData)
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");

    const savedCategoryAuthorId = categoryData?.userId?.toString();

    if (savedCategoryAuthorId !== userId)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This is not your saved category",
      );

    return await SavedCategoryModel.findByIdAndDelete(id);
  } catch (error) {
    return errorHandler(error);
  }
};

export const SavedCategoryModel = model<ISavedCategory, ISavedCategoryModel>(
  SavedCategoryConstant.SAVED_CATEGORY_COLLECTION_NAME,
  savedCategorySchema,
);
