import { model } from "mongoose";
import { ICategory, ICategoryModel } from "../category.interface";
import { CategoryConstant } from "../category.constant";

/* category schema start =================== */
import categorySchema from "./model.schema";
/* category schema end =================== */

/* category schema middleware start =================== */
import "./model.middleware";
/* category schema middleware end =================== */

/* category schema static method start =================== */
import "./model.static.method";
/* category schema static method end =================== */

export const CategoryModel = model<ICategory, ICategoryModel>(
  CategoryConstant.CATEGORY_COLLECTION_NAME,
  categorySchema,
);
