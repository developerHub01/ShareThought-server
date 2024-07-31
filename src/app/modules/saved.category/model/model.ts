import { model } from "mongoose";
import {
  ISavedCategory,
  ISavedCategoryModel,
} from "../saved.category.interface";
import { SavedCategoryConstant } from "../saved.category.constant";

/* saved category schema start ======================= */
import savedCategorySchema from "./model.schema";
/* saved category schema end ======================= */

/* saved category schema middleware start ======================= */
import "./model.middleware";
/* saved category schema middleware end ======================= */

/* saved category schema static methods start ======================= */
import "./model.static.method";
/* saved category schema static methods end ======================= */

export const SavedCategoryModel = model<ISavedCategory, ISavedCategoryModel>(
  SavedCategoryConstant.SAVED_CATEGORY_COLLECTION_NAME,
  savedCategorySchema,
);
