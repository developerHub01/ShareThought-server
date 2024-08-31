import httpStatus from "http-status";
import { CategoryModel } from "./model";
import categorySchema from "./model.schema";
import { ClientSession } from "mongoose";
import AppError from "../../../errors/AppError";
import { CategoryConstant } from "../category.constant";
import {
  ICategory,
  ICreateCategory,
  IUpdateCategory,
} from "../category.interface";
import { PostModel } from "../../post/model/model";

categorySchema.statics.isCategoryExist = async (
  categoryId: string,
): Promise<boolean> => {
  return Boolean(await CategoryModel.findById(categoryId));
};

categorySchema.statics.isMyCategory = async (
  categoryId: string,
  channelId: string,
): Promise<boolean> => {
  const categoryData = await CategoryModel.findById(categoryId);

  if (!categoryData)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  return Boolean(channelId === categoryData?.channelId?.toString());
};

categorySchema.statics.haveAccessCategory = async (
  categoryId: string,
  userOrChannelId: string,
  idType: "channelId" | "userId",
): Promise<unknown> => {
  const categoryData = await CategoryModel.findById(categoryId);

  if (!categoryData) return false;

  const { channelId: categoryChannelId, accessType } = categoryData;

  if (
    idType === "channelId" &&
    userOrChannelId === categoryChannelId?.toString()
  )
    return true;

  return accessType === CategoryConstant.CATEGORY_ACCESS_TYPE.PUBLIC;
};

categorySchema.statics.haveAccessToModify = async (
  categoryId: string,
  channelId: string,
): Promise<boolean> => {
  const categoryData = await CategoryModel.findById(categoryId);

  if (!categoryData)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  const categoryChannelId = categoryData?.channelId?.toString();

  return categoryChannelId === channelId;
};

categorySchema.statics.findCategoryById = async (
  categoryId: string,
): Promise<ICategory | unknown> => {
  return await CategoryModel.findById(categoryId)
    .populate({
      path: "postList",
    })
    .populate({
      path: "channelId",
    });
};

categorySchema.statics.isSameNameCategoryExistInMyChannelCategoryList = async (
  channelId: string,
  categoryName: string,
): Promise<boolean | unknown> => {
  return Boolean(
    await CategoryModel.findOne({
      channelId,
      name: categoryName,
    }),
  );
};

categorySchema.statics.createCategory = async (payload: ICreateCategory) => {
  const { channelId, name: chnannelName } = payload;

  if (
    await CategoryModel.isSameNameCategoryExistInMyChannelCategoryList(
      channelId,
      chnannelName,
    )
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Category with same name already exist",
    );

  return await CategoryModel.create({
    ...payload,
  });
};

categorySchema.statics.updateCategory = async (
  payload: Partial<IUpdateCategory>,
  categoryId: string,
): Promise<unknown> => {
  return await CategoryModel.findByIdAndUpdate(
    categoryId,
    { ...payload },
    { new: true },
  );
};

categorySchema.statics.addPostInCategory = async (
  categoryId: string,
  postId: string,
): Promise<ICategory | unknown> => {
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

categorySchema.statics.removePostFromCategory = async (
  categoryId: string,
  postId: string,
): Promise<ICategory | unknown> => {
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

  if (!postListLength) await CategoryModel.deleteCategory(categoryId);

  return result;
};

categorySchema.statics.deleteCategory = async (
  categoryId: string,
): Promise<unknown> => {
  return await CategoryModel.findByIdAndDelete(categoryId);
};

categorySchema.statics.removeSpecificPostFromAllCategoryList = async (
  postId: string,
  session?: ClientSession,
) => {
  return await CategoryModel.updateMany(
    { postList: postId },
    {
      $pull: {
        postList: { postId },
      },
    },
    { ...(session ? { session } : {}) },
  );
};
