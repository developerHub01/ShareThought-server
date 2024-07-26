import { z as zod } from "zod";
import { CategoryConstant } from "./category.constant";

const accessTypeList = Object.keys(CategoryConstant.CATEGORY_ACCESS_TYPE) as [
  keyof typeof CategoryConstant.CATEGORY_ACCESS_TYPE,
];

const createCategory = zod.object({
  name: zod
    .string()
    .min(
      CategoryConstant.CATEGORY_NAME_MIN_LENGTH,
      `Category name minimum length is ${CategoryConstant.CATEGORY_NAME_MIN_LENGTH}`,
    )
    .max(
      CategoryConstant.CATEGORY_NAME_MAX_LENGTH,
      `Category name maximum length is ${CategoryConstant.CATEGORY_NAME_MAX_LENGTH}`,
    ),
  postList: zod.array(zod.string()).min(1),
});

const updateCategory = zod.object({
  name: zod
    .string()
    .min(
      CategoryConstant.CATEGORY_NAME_MIN_LENGTH,
      `Category name minimum length is ${CategoryConstant.CATEGORY_NAME_MIN_LENGTH}`,
    )
    .max(
      CategoryConstant.CATEGORY_NAME_MAX_LENGTH,
      `Category name maximum length is ${CategoryConstant.CATEGORY_NAME_MAX_LENGTH}`,
    )
    .optional(),
  description: zod
    .string()
    .min(
      CategoryConstant.CATEGORY_NAME_MIN_LENGTH,
      `Category name minimum length is ${CategoryConstant.CATEGORY_NAME_MIN_LENGTH}`,
    )
    .max(
      CategoryConstant.CATEGORY_NAME_MAX_LENGTH,
      `Category name maximum length is ${CategoryConstant.CATEGORY_NAME_MAX_LENGTH}`,
    )
    .optional(),
  accessType: zod.enum(accessTypeList).optional(),
  postList: zod
    .array(zod.string())
    .min(1, `postList contain atlest one post`)
    .optional(),
});

export const CategoryValidation = { createCategory, updateCategory };
