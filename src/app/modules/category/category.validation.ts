import { z as zod } from "zod";
import { CategoryConstant } from "./category.constant";

const createCategory = zod.object({
  channelId: zod.string(),
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
  postList: zod.array(zod.string()).min(1, `postList contain atlest one post`),
});

export const CategoryValidation = { createCategory, updateCategory };
