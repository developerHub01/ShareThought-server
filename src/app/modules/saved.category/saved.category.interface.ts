import { Model, Types } from "mongoose";

export interface ISavedCategory {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
}

export interface ISavedCategoryModel extends Model<ISavedCategory> {
  
}
