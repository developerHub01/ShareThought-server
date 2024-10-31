import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { SavedCategoryModel } from "./model/model";

const findSavedCategory = async ({
  query,
  userId,
}: {
  query: Record<string, unknown>;
  userId: string;
}) => {
  const savedCategoryQuery = new QueryBuilder(
    SavedCategoryModel.find({
      userId,
    }).populate({
      path: "categoryId",
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await savedCategoryQuery.countTotal();
  const result = await savedCategoryQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const addToSaveCategory = async ({
  categoryId,
  userId,
}: {
  categoryId: string;
  userId: string;
}) => {
  return await SavedCategoryModel.create({
    categoryId,
    userId,
  });
};

const removeFromSaveCategoryByCategoryId = async ({
  categoryId,
  userId,
}: {
  categoryId: string;
  userId: string;
}) => {
  return await SavedCategoryModel.deleteOne({
    categoryId,
    userId,
  });
};

const removeFromSaveCategoryBySavedCategoryId = async ({
  id /* saved category id */,
  userId,
}: {
  id: string /* saved category id */;
  userId: string;
}) => {
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

export const SavedCategoryServices = {
  findSavedCategory,
  addToSaveCategory,
  removeFromSaveCategoryByCategoryId,
  removeFromSaveCategoryBySavedCategoryId,
};
