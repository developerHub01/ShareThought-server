import { z as zod } from "zod";
import { CommentConstant } from "./comment.constant";

const createOrUpdateComment = zod.object({
  content: zod
    .string({
      required_error: "content is required",
      invalid_type_error: "content must be string",
    })
    .max(
      CommentConstant.COMMENT_CONTENT_MAX_LENGTH,
      `post title max length is ${CommentConstant.COMMENT_CONTENT_MAX_LENGTH}`,
    )
    .min(
      CommentConstant.COMMENT_CONTENT_MIN_LENGTH,
      `post title max length is ${CommentConstant.COMMENT_CONTENT_MIN_LENGTH}`,
    ),
  commentImage: zod.string().optional(),
});

export const CommentValidation = { createOrUpdateComment };
