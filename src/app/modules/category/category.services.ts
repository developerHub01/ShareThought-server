import QueryBuilder from "../../builder/QueryBuilder";
import { CategoryConstant } from "./category.constant";
import { ICreateCategory, IUpdateCategory } from "./category.interface";
import { CategoryModel } from "./model/model";

const findCategoryById = async (categoryId: string) => {
  return await CategoryModel.findCategoryById(categoryId);
};

const findCategoryByChannelId = async (
  query: Record<string, unknown>,
  channelId: string,
  myChannelId: string,
) => {
  const categoryQuery = new QueryBuilder(
    CategoryModel.find({
      channelId,
      ...(channelId !== myChannelId && {
        accessType: CategoryConstant.CATEGORY_ACCESS_TYPE.PUBLIC,
      }),
    }).populate({
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
};

const createCategory = async (payload: ICreateCategory) => {
  return await CategoryModel.createCategory(payload);
};

const updateCategory = async (payload: IUpdateCategory, categoryId: string) => {
  return await CategoryModel.updateCategory(payload, categoryId);
};

const addPostInCategory = async (categoryId: string, postId: string) => {
  return await CategoryModel.addPostInCategory(categoryId, postId);
};

const removePostFromCategory = async (categoryId: string, postId: string) => {
  return await CategoryModel.removePostFromCategory(categoryId, postId);
};

const deleteCategory = async (categoryId: string) => {
  return await CategoryModel.deleteCategory(categoryId);
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
