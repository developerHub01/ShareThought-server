import httpStatus from "http-status";
import { CategoryModel } from "./model";
import categorySchema from "./model.schema";
import { ClientSession } from "mongoose";
import errorHandler from "../../../errors/errorHandler";
import AppError from "../../../errors/AppError";
import { CategoryConstant } from "../category.constant";
import { ICategory, ICreateCategory, IUpdateCategory } from "../category.interface";
import { PostModel } from "../../post/model/model";

categorySchema.statics.isCategoryExist = async (
  categoryId: string,
): Promise<boolean> => {
  try {
    return Boolean(await CategoryModel.findById(categoryId));
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.isMyCategory = async (
  categoryId: string,
  channelId: string,
): Promise<boolean> => {
  try {
    const categoryData = await CategoryModel.findById(categoryId);

    if (!categoryData)
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");

    return Boolean(channelId === categoryData?.channelId?.toString());
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.haveAccessCategory = async (
  categoryId: string,
  userOrChannelId: string,
  idType: "channelId" | "userId",
): Promise<unknown> => {
  try {
    const categoryData = await CategoryModel.findById(categoryId);

    if (!categoryData) return false;

    const { channelId: categoryChannelId, accessType } = categoryData;

    if (
      idType === "channelId" &&
      userOrChannelId === categoryChannelId?.toString()
    )
      return true;

    return accessType === CategoryConstant.CATEGORY_ACCESS_TYPE.PUBLIC;
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.haveAccessToModify = async (
  categoryId: string,
  channelId: string,
): Promise<boolean> => {
  try {
    const categoryData = await CategoryModel.findById(categoryId);

    if (!categoryData)
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");

    const categoryChannelId = categoryData?.channelId?.toString();

    return categoryChannelId === channelId;
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.findCategoryById = async (
  categoryId: string,
): Promise<ICategory | unknown> => {
  try {
    return await CategoryModel.findById(categoryId)
      .populate({
        path: "postList",
      })
      .populate({
        path: "channelId",
      });
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.isSameNameCategoryExistInMyChannelCategoryList = async (
  channelId: string,
  categoryName: string,
): Promise<boolean | unknown> => {
  try {
    return Boolean(
      await CategoryModel.findOne({
        channelId,
        name: categoryName,
      }),
    );
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.createCategory = async (payload: ICreateCategory) => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.updateCategory = async (
  payload: Partial<IUpdateCategory>,
  categoryId: string,
): Promise<unknown> => {
  try {
    return await CategoryModel.findByIdAndUpdate(
      categoryId,
      { ...payload },
      { new: true },
    );
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.addPostInCategory = async (
  categoryId: string,
  postId: string,
): Promise<ICategory | unknown> => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.removePostFromCategory = async (
  categoryId: string,
  postId: string,
): Promise<ICategory | unknown> => {
  try {
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
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.deleteCategory = async (
  categoryId: string,
): Promise<unknown> => {
  try {
    return await CategoryModel.findByIdAndDelete(categoryId);
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.removeSpecificPostFromAllCategoryList = async (
  postId: string,
  session?: ClientSession,
) => {
  try {
    return await CategoryModel.updateMany(
      { postList: postId },
      {
        $pull: {
          postList: { postId },
        },
      },
      { ...(session ? { session } : {}) },
    );
  } catch (error) {
    return errorHandler(error);
  }
};
