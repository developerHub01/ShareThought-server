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
  findCategoryById(categoryId: string): Promise<ICategory | unknown>;

  haveAccessCategory(
    categoryId: string,
    userOrChannelId: string,
    idType: "channelId" | "userId",
  ): Promise<unknown>;

  isSameNameCategoryExistInMyChannelCategoryList(
    channelId: string,
    categoryName: string,
  ): Promise<boolean | unknown>;

  isCategoryExist(categoryId: string): Promise<boolean>;

  isMyCategory(categoryId: string, channelId: string): Promise<boolean>;

  createCategory(payload: ICreateCategory): Promise<unknown>;

  deleteCategory(categoryId: string): Promise<unknown>;

  haveAccessToModify(categoryId: string, channelId: string): Promise<boolean>;

  addPostInCategory(
    categoryId: string,
    postId: string,
  ): Promise<ICategory | unknown>;

  removePostFromCategory(
    categoryId: string,
    postId: string,
  ): Promise<ICategory | unknown>;

  updateCategory(
    payload: Partial<IUpdateCategory>,
    categoryId: string,
  ): Promise<unknown>;

  removeSpecificPostFromAllCategoryList(
    postId: string,
    session?: ClientSession,
  ): Promise<unknown>;
}
