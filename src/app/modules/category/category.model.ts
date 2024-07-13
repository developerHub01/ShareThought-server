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
import { ChannelModel } from "../channel/channel.model";
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

categorySchema.statics.haveAccessCategory = async (
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  try {
    const categoryData = await CategoryModel.findById(categoryId).populate({
      path: "channelId",
      select: "authorId",
    });

    if (!categoryData) return false;

    const {
      channelId: { authorId },
    } = categoryData as typeof categoryData & {
      channelId: { authorId: string };
    };

    return Boolean(authorId?.toString() === userId);
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

categorySchema.statics.isCategoryExist = async (
  categoryId: string,
): Promise<boolean> => {
  try {
    return Boolean(await CategoryModel.findById(categoryId));
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.haveAccessToModify = async (
  categoryId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const isCategoryExist = await CategoryModel.isCategoryExist(categoryId);

    if (!isCategoryExist)
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");

    const categoryData = await CategoryModel.findById(categoryId)
      .select("channelId")
      .populate({
        path: "channelId",
        select: "authorId",
      });

    const channelAuthorId = (
      categoryData as unknown as { channelId: { authorId?: string } }
    )?.channelId?.authorId?.toString();

    return channelAuthorId === userId;
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

categorySchema.statics.createCategory = async (
  payload: ICreateCategory,
  userId: string,
) => {
  try {
    const { channelId, name: chnannelName } = payload;

    if (!(await ChannelModel.isChannelMine(channelId, userId)))
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to create category in that channel",
      );

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

categorySchema.statics.addPostInCategory = async (
  categoryId: string,
  postId: string,
  userId: string,
): Promise<ICategory | unknown> => {
  try {
    /*
     * Checking is it my post or not
     */
    const haveAccessToModify =
      (await CategoryModel.haveAccessToModify(categoryId, userId)) &&
      (await PostModel.isMyPost(postId, userId));

    if (!haveAccessToModify)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "you have no access to modify that category",
      );

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
  userId: string,
): Promise<ICategory | unknown> => {
  try {
    const haveAccessToModify = await CategoryModel.haveAccessToModify(
      categoryId,
      userId,
    );

    if (!haveAccessToModify)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "you have no access to modify that category",
      );

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

categorySchema.statics.deleteCategory = async (
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  try {
    const haveAccessToModify = await CategoryModel.haveAccessToModify(
      categoryId,
      userId,
    );

    if (!haveAccessToModify)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "you have no access to modify that category",
      );

    return await CategoryModel.findByIdAndDelete(categoryId);
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.updateCategory = async (
  payload: Partial<IUpdateCategory>,
  categoryId: string,
  userId: string,
): Promise<unknown> => {
  try {
    /*
     * Checking is it my post or not
     */
    const haveAccessToModify = await CategoryModel.haveAccessToModify(
      categoryId,
      userId,
    );

    if (!haveAccessToModify)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "you have no access to modify that category",
      );

    return await CategoryModel.findByIdAndUpdate(
      categoryId,
      { ...payload },
      { new: true },
    );
  } catch (error) {
    return errorHandler(error);
  }
};

categorySchema.statics.removeSpecificPostFromAllCategoryList = async (
  postId: string,
  userId: string,
  session?: ClientSession,
) => {
  try {
    const options = session ? { session } : {};
    if (!(await PostModel.isMyPost(postId, userId)))
      throw new AppError(httpStatus.UNAUTHORIZED, "this is not your post");

    return await CategoryModel.updateMany(
      { postList: postId },
      {
        $pull: {
          postList: { postId },
        },
      },
      options,
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const CategoryModel = model<ICategory, ICategoryModel>(
  CategoryConstant.CATEGORY_COLLECTION_NAME,
  categorySchema,
);
