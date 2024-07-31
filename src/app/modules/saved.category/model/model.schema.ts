import { Schema } from "mongoose";
import { ISavedCategory, ISavedCategoryModel } from "../saved.category.interface";
import { UserConstant } from "../../user/user.constant";
import { CategoryConstant } from "../../category/category.constant";

const savedCategorySchema = new Schema<ISavedCategory, ISavedCategoryModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: UserConstant.USER_COLLECTION_NAME,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: CategoryConstant.CATEGORY_COLLECTION_NAME,
    },
  },
  {
    timestamps: true,
  },
);

export default savedCategorySchema;
