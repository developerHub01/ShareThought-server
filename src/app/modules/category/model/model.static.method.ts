import httpStatus from "http-status";
import { CategoryModel } from "./model";
import categorySchema from "./model.schema";
import { ClientSession } from "mongoose";
import AppError from "../../../errors/AppError";
import { CategoryConstant } from "../category.constant";
import {
  ICategory,
} from "../category.interface";

categorySchema.statics.isCategoryExist = async ({
  categoryId,
}: {
  categoryId: string;
}): Promise<boolean> => {
  return Boolean(await CategoryModel.findById(categoryId));
};

categorySchema.statics.isMyCategory = async ({
  categoryId,
  channelId,
}: {
  categoryId: string;
  channelId: string;
}): Promise<boolean> => {
  const categoryData = await CategoryModel.findById(categoryId);

  if (!categoryData)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  return Boolean(channelId === categoryData?.channelId?.toString());
};

categorySchema.statics.haveAccessCategory = async ({
  categoryId,
  userOrChannelId,
  idType,
}: {
  categoryId: string;
  userOrChannelId: string;
  idType: "channelId" | "userId";
}): Promise<unknown> => {
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

categorySchema.statics.haveAccessToModify = async ({
  categoryId,
  channelId,
}: {
  categoryId: string;
  channelId: string;
}): Promise<boolean> => {
  const categoryData = await CategoryModel.findById(categoryId);

  if (!categoryData)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  const categoryChannelId = categoryData?.channelId?.toString();

  return categoryChannelId === channelId;
};

categorySchema.statics.findCategoryById = async ({
  categoryId,
}: {
  categoryId: string;
}): Promise<ICategory | unknown> => {
  return await CategoryModel.findById(categoryId)
    .populate({
      path: "postList",
    })
    .populate({
      path: "channelId",
    });
};

categorySchema.statics.isSameNameCategoryExistInMyChannelCategoryList = async ({
  channelId,
  categoryName,
}: {
  channelId: string;
  categoryName: string;
}): Promise<boolean | unknown> => {
  return Boolean(
    await CategoryModel.findOne({
      channelId,
      name: categoryName,
    }),
  );
};

categorySchema.statics.removeSpecificPostFromAllCategoryList = async ({
  postId,
  session,
}: {
  postId: string;
  session?: ClientSession;
}) => {
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
