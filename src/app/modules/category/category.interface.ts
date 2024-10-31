import { ClientSession, Model, Types } from "mongoose";
import { CategoryConstant } from "./category.constant";

const accessTypeList = Object.values(CategoryConstant.CATEGORY_ACCESS_TYPE);
export type TAccessType = (typeof accessTypeList)[number];

export interface ICategory {
  channelId: Types.ObjectId;
  name: string;
  description?: string;
  thumbnails?: string;
  accessType: TAccessType;
  postList?: Array<Types.ObjectId>;
}

export interface ICreateCategory {
  channelId: string;
  name: string;
  description?: string;
  accessType?: TAccessType;
  postList?: Array<string>;
}

export interface IUpdateCategory {
  name: string;
  description: string;
  accessType: TAccessType;
  postList: Array<string>;
}

export interface ICategoryModel extends Model<ICategory> {
  findCategoryById({
    categoryId,
  }: {
    categoryId: string;
  }): Promise<ICategory | unknown>;

  haveAccessCategory({
    categoryId,
    userOrChannelId,
    idType,
  }: {
    categoryId: string;
    userOrChannelId: string;
    idType: "channelId" | "userId";
  }): Promise<unknown>;

  isSameNameCategoryExistInMyChannelCategoryList({
    channelId,
    categoryName,
  }: {
    channelId: string;
    categoryName: string;
  }): Promise<boolean | unknown>;

  isCategoryExist({ categoryId }: { categoryId: string }): Promise<boolean>;

  isMyCategory({
    categoryId,
    channelId,
  }: {
    categoryId: string;
    channelId: string;
  }): Promise<boolean>;

  haveAccessToModify({
    categoryId,
    channelId,
  }: {
    categoryId: string;
    channelId: string;
  }): Promise<boolean>;

  removeSpecificPostFromAllCategoryList({
    postId,
    session,
  }: {
    postId: string,
    session?: ClientSession,
  }): Promise<unknown>;
}
