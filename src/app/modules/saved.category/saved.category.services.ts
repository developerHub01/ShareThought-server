import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { SavedCategoryModel } from "./model/model";

const findSavedCategory = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  try {
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
  } catch (error) {
    errorHandler(error);
  }
};

const addToSaveCategory = async (categoryId: string, userId: string) => {
  try {
    return await SavedCategoryModel.addToSaveCategory(categoryId, userId);
  } catch (error) {
    errorHandler(error);
  }
};

const removeFromSaveCategoryByCategoryId = async (
  categoryId: string,
  userId: string,
) => {
  try {
    return await SavedCategoryModel.removeFromSaveCategoryByCategoryId(
      categoryId,
      userId,
    );
  } catch (error) {
    errorHandler(error);
  }
};

const removeFromSaveCategoryBySavedCategoryId = async (
  id: string /* saved category id */,
  userId: string,
) => {
  try {
    return await SavedCategoryModel.removeFromSaveCategoryBySavedCategoryId(
      id,
      userId,
    );
  } catch (error) {
    errorHandler(error);
  }
};

export const SavedCategoryServices = {
  findSavedCategory,
  addToSaveCategory,
  removeFromSaveCategoryByCategoryId,
  removeFromSaveCategoryBySavedCategoryId,
};
