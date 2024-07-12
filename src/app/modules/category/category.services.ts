import QueryBuilder from "../../builder/QueryBuilder";
import errorHandler from "../../errors/errorHandler";
import { ICreateCategory, IUpdateCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const findCategoryById = async (categoryId: string) => {
  try {
    return await CategoryModel.findCategoryById(categoryId);
  } catch (error) {
    return errorHandler(error);
  }
};

const findCategoryByChannelId = async (
  query: Record<string, unknown>,
  channelId: string,
) => {
  try {
    const categoryQuery = new QueryBuilder(
      CategoryModel.find({ channelId }).populate({
        path: "channelId",
        select: "channelName channelAvatar",
      }),
      query,
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await categoryQuery.countTotal();
    const result = await categoryQuery.modelQuery;

    return {
      meta,
      result,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const createCategory = async (payload: ICreateCategory, userId: string) => {
  try {
    return await CategoryModel.createCategory(payload, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const updateCategory = async (
  payload: IUpdateCategory,
  categoryId: string,
  userId: string,
) => {
  try {
    return await CategoryModel.updateCategory(payload, categoryId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const addPostInCategory = async (
  categoryId: string,
  postId: string,
  userId: string,
) => {
  try {
    return await CategoryModel.addPostInCategory(categoryId, postId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

const removePostFromCategory = async (
  categoryId: string,
  postId: string,
  userId: string,
) => {
  try {
    return await CategoryModel.removePostFromCategory(
      categoryId,
      postId,
      userId,
    );
  } catch (error) {
    return errorHandler(error);
  }
};

const deleteCategory = async (categoryId: string, userId: string) => {
  try {
    return await CategoryModel.deleteCategory(categoryId, userId);
  } catch (error) {
    return errorHandler(error);
  }
};

export const CategoryServices = {
  findCategoryById,
  findCategoryByChannelId,
  createCategory,
  updateCategory,
  addPostInCategory,
  removePostFromCategory,
  deleteCategory,
};
