import { Model, Types } from "mongoose";

export interface ISavedCategory {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
}

export interface ISavedCategoryModel extends Model<ISavedCategory> {
  addToSaveCategory(categoryId: string, userId: string): Promise<unknown>;

  removeFromSaveCategoryByCategoryId(
    categoryId: string,
    userId: string,
  ): Promise<unknown>;

  removeFromSaveCategoryBySavedCategoryId(id: string, userId: string): Promise<unknown>;
}
