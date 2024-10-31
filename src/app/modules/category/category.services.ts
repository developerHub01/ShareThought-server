import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { PostModel } from "../post/model/model";
import { CategoryConstant } from "./category.constant";
import { ICreateCategory, IUpdateCategory } from "./category.interface";
import { CategoryModel } from "./model/model";

const findCategoryById = async ({ categoryId }: { categoryId: string }) => {
  return await CategoryModel.findCategoryById({ categoryId });
};

const findCategoryByChannelId = async ({
  query,
  channelId,
  myChannelId,
}: {
  query: Record<string, unknown>;
  channelId: string;
  myChannelId: string;
}) => {
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

const createCategory = async ({ payload }: { payload: ICreateCategory }) => {
  const { channelId, name: categoryName } = payload;

  if (
    await CategoryModel.isSameNameCategoryExistInMyChannelCategoryList({
      channelId,
      categoryName,
    })
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Category with same name already exist",
    );

  return await CategoryModel.create({
    ...payload,
  });
};

const updateCategory = async ({
  payload,
  categoryId,
}: {
  payload: IUpdateCategory;
  categoryId: string;
}) => {
  return await CategoryModel.findByIdAndUpdate(
    categoryId,
    { ...payload },
    { new: true },
  );
};

const addPostInCategory = async ({
  categoryId,
  postId,
}: {
  categoryId: string;
  postId: string;
}) => {
  const isPublicPost = await PostModel.isPublicPostById(postId);

  if (!isPublicPost)
    throw new AppError(httpStatus.BAD_REQUEST, "to add post must be public");

  return await CategoryModel.updateOne(
    { _id: categoryId },
    {
      $addToSet: {
        postList: postId,
      },
    },
  );
};

const removePostFromCategory = async ({
  categoryId,
  postId,
}: {
  categoryId: string;
  postId: string;
}) => {
  const result = await CategoryModel.updateOne(
    { _id: categoryId },
    {
      $pull: {
        postList: postId,
      },
    },
  );

  const postListLength = (await CategoryModel.findById(categoryId))?.postList
    ?.length;

  if (!postListLength) await CategoryServices.deleteCategory({ categoryId });

  return result;
};

const deleteCategory = async ({ categoryId }: { categoryId: string }) => {
  return await CategoryModel.findByIdAndDelete(categoryId);
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
