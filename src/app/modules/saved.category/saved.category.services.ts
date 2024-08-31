import QueryBuilder from "../../builder/QueryBuilder";
import { SavedCategoryModel } from "./model/model";

const findSavedCategory = async (
  query: Record<string, unknown>,
  userId: string,
) => {
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

const addToSaveCategory = async (categoryId: string, userId: string) => {
  return await SavedCategoryModel.addToSaveCategory(categoryId, userId);
};

const removeFromSaveCategoryByCategoryId = async (
  categoryId: string,
  userId: string,
) => {
  return await SavedCategoryModel.removeFromSaveCategoryByCategoryId(
    categoryId,
    userId,
  );
};

const removeFromSaveCategoryBySavedCategoryId = async (
  id: string /* saved category id */,
  userId: string,
) => {
  return await SavedCategoryModel.removeFromSaveCategoryBySavedCategoryId(
    id,
    userId,
  );
};

export const SavedCategoryServices = {
  findSavedCategory,
  addToSaveCategory,
  removeFromSaveCategoryByCategoryId,
  removeFromSaveCategoryBySavedCategoryId,
};
