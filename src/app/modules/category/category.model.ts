import { ClientSession, model, Schema } from "mongoose";
import { CategoryConstant } from "./category.constant";
import {
  ICategory,
  ICategoryModel,
  ICreateCategory,
  IUpdateCategory,
} from "./category.interface";
import { ChannelConstant } from "../channel/channel.constant";
import { PostConstant } from "../post/post.constant";
import errorHandler from "../../errors/errorHandler";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { PostModel } from "../post/post.model";

const categorySchema = new Schema<ICategory, ICategoryModel>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: ChannelConstant.CHANNEL_COLLECTION_NAME,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: CategoryConstant.CATEGORY_NAME_MIN_LENGTH,
      maxlength: CategoryConstant.CATEGORY_NAME_MAX_LENGTH,
    },
    description: {
      type: String,
      trim: true,
      minlength: CategoryConstant.CATEGORY_DESCRIPTION_MIN_LENGTH,
      maxlength: CategoryConstant.CATEGORY_DESCRIPTION_MAX_LENGTH,
    },
    thumbnails: {
      type: String,
      trim: true,
    },
    accessType: {
      type: String,
      enum: Object.values(CategoryConstant.CATEGORY_ACCESS_TYPE),
      default: CategoryConstant.CATEGORY_ACCESS_TYPE.PUBLIC,
    },
    postList: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: PostConstant.POST_COLLECTION_NAME,
        },
      ],
      default: [],
      minlength: 1,
    },
  },
  {
    timestamps: true,
  },
);

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

export const CategoryModel = model<ICategory, ICategoryModel>(
  CategoryConstant.CATEGORY_COLLECTION_NAME,
  categorySchema,
);
