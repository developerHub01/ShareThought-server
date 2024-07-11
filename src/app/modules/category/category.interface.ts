import { Model, Types } from "mongoose";
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
  findCategoryById(id: string): Promise<ICategory | unknown>;
  isCategoryExist(id: string): Promise<boolean>;
  createCategory(payload: string, userId: string): Promise<unknown>;
  deleteCategory(categoryId: string, userId: string): Promise<unknown>;
  haveAccessToModify(categoryId: string, userId: string): Promise<boolean>;
  addPostInCategory(
    categoryId: string,
    postId: string,
    userId: string,
  ): Promise<ICategory | unknown>;
  removePostFromCategory(
    categoryId: string,
    postId: string,
    userId: string,
  ): Promise<ICategory | unknown>;
  updateCategory(
    payload: Partial<IUpdateCategory>,
    categoryId: string,
    userId: string,
  ): Promise<unknown>;
}