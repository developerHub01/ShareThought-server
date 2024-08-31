import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { SavedCategoryModel } from "./model";
import savedCategorySchema from "./model.schema";

savedCategorySchema.statics.addToSaveCategory = async (
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  return await SavedCategoryModel.create({
    categoryId,
    userId,
  });
};

savedCategorySchema.statics.removeFromSaveCategoryByCategoryId = async (
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  return await SavedCategoryModel.deleteOne({
    categoryId,
    userId,
  });
};

savedCategorySchema.statics.removeFromSaveCategoryBySavedCategoryId = async (
  id: string,
  userId: string,
): Promise<unknown> => {
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
};
