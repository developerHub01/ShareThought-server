import { z as zod } from "zod";
import { PostConstant } from "./post.constant";

const createPostValidationSchema = zod.object({
  title: zod
    .string({
      required_error: "post title is required",
      invalid_type_error: "post title must be string",
    })
    .max(
      PostConstant.POST_TITLE_MAX_LENGTH,
      `post title max length is ${PostConstant.POST_TITLE_MAX_LENGTH}`,
    )
    .min(
      PostConstant.POST_TITLE_MIN_LENGTH,
      `post title max length is ${PostConstant.POST_TITLE_MIN_LENGTH}`,
    ),
  content: zod
    .string({
      required_error: "post content is required",
      invalid_type_error: "post content must be string",
    })
    .max(
      PostConstant.POST_CONTENT_MAX_LENGTH,
      `post title max length is ${PostConstant.POST_CONTENT_MAX_LENGTH}`,
    )
    .min(
      PostConstant.POST_CONTENT_MIN_LENGTH,
      `post title max length is ${PostConstant.POST_CONTENT_MIN_LENGTH}`,
    ),
  isPublished: zod.boolean().optional().default(false),
  banner: zod.string().optional(),
  scheduledTime: zod.string().optional(),
  tags: zod.string().array().optional(),
});

const updatePostValidationSchema = zod.object({
  title: zod
    .string({
      required_error: "post title is required",
      invalid_type_error: "post title must be string",
    })
    .max(
      PostConstant.POST_TITLE_MAX_LENGTH,
      `post title max length is ${PostConstant.POST_TITLE_MAX_LENGTH}`,
    )
    .min(
      PostConstant.POST_TITLE_MIN_LENGTH,
      `post title max length is ${PostConstant.POST_TITLE_MIN_LENGTH}`,
    )
    .optional(),
  content: zod
    .string({
      required_error: "post content is required",
      invalid_type_error: "post content must be string",
    })
    .max(
      PostConstant.POST_CONTENT_MAX_LENGTH,
      `post title max length is ${PostConstant.POST_CONTENT_MAX_LENGTH}`,
    )
    .min(
      PostConstant.POST_CONTENT_MIN_LENGTH,
      `post title max length is ${PostConstant.POST_CONTENT_MIN_LENGTH}`,
    )
    .optional(),
  isPublished: zod.boolean().optional().default(false),
  banner: zod.string().optional(),
  scheduledTime: zod.string().optional(),
  tags: zod.string().array().optional(),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
