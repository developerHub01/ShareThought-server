import { z as zod } from "zod";
import { CommunityPostConstant } from "./community.post.constant";
import { Validation } from "../../validation/validation";

const postTypeList = Object.keys(
  CommunityPostConstant.COMMUNITY_POST_TYPES,
) as [keyof typeof CommunityPostConstant.COMMUNITY_POST_TYPES];

const postImageDetailsValidationSchema = zod.object({
  image: zod.string({
    required_error: "post image is required",
    invalid_type_error: "post image must be string",
  }),
});

const postSharedPostDetailsValidationSchema = zod.object({
  postId: zod.string({
    required_error: "post id is required",
    invalid_type_error: "post id must be string",
  }),
});

const postPollOptionValidationSchema = zod.object({
  text: zod.string({
    required_error: "poll option text is required",
    invalid_type_error: "poll option text must be string",
  }),
});

const postPullWithImageOptionValidationSchema = zod.object({
  text: zod
    .string({
      required_error: "option text is required",
      invalid_type_error: "option text must be string",
    })
    .max(
      CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH,
      `option text max length is ${CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH}`,
    )
    .min(
      CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH,
      `option text max length is ${CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH}`,
    ),
  image: zod.string({
    required_error: "option image is required",
    invalid_type_error: "option image must be string",
  }),
});

const postPollDetailsValidationSchema = zod.object({
  options: postPollOptionValidationSchema
    .array()
    .min(CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST),
});

const postPollWithImageDetailsValidationSchema = zod.object({
  options: postPullWithImageOptionValidationSchema
    .array()
    .min(CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST),
});

const postQuizDetailsOptionValidationSchema = zod.object({
  text: zod
    .string({
      required_error: "quiz option text is required",
      invalid_type_error: "quiz option text must be string",
    })
    .max(
      CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH,
      `quiz option text max length is ${CommunityPostConstant.COMMUNITY_POST_OPTION_MAX_LENGTH}`,
    )
    .min(
      CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH,
      `quiz option text max length is ${CommunityPostConstant.COMMUNITY_POST_OPTION_MIN_LENGTH}`,
    ),
  isCurrectAnswer: zod.boolean(),
  currectAnswerExplaination: zod.string().trim().optional(),
});

const postQuizDetailsValidationSchema = zod.object({
  options: postQuizDetailsOptionValidationSchema
    .array()
    .min(CommunityPostConstant.COMMUNITY_POST_MIN_OPTION_IN_EACH_POST),
});

const createPostValidationSchema = zod.object({
  text: zod
    .string({
      required_error: "post title is required",
      invalid_type_error: "post title must be string",
    })
    .max(
      CommunityPostConstant.COMMUNITY_POST_TEXT_MAX_LENGTH,
      `post title max length is ${CommunityPostConstant.COMMUNITY_POST_TEXT_MAX_LENGTH}`,
    )
    .min(
      CommunityPostConstant.COMMUNITY_POST_TEXT_MIN_LENGTH,
      `post title max length is ${CommunityPostConstant.COMMUNITY_POST_TEXT_MIN_LENGTH}`,
    ),
  postImageDetails: postImageDetailsValidationSchema.optional(),
  postSharedPostDetails: postSharedPostDetailsValidationSchema.optional(),
  postPollDetails: postPollDetailsValidationSchema.optional(),
  postPollWithImageDetails: postPollWithImageDetailsValidationSchema.optional(),
  postQuizDetails: postQuizDetailsValidationSchema.optional(),
  postType: zod.enum(postTypeList).default("TEXT").optional(),
  isPublished: zod
    .string()
    .transform(Validation.parseBoolean)
    .optional()
    .default("true")
    .pipe(zod.boolean()),
  scheduledTime: zod.string().optional(),
});

const updatePostValidationSchema = zod.object({
  text: zod
    .string({
      required_error: "post title is required",
      invalid_type_error: "post title must be string",
    })
    .max(
      CommunityPostConstant.COMMUNITY_POST_TEXT_MAX_LENGTH,
      `post title max length is ${CommunityPostConstant.COMMUNITY_POST_TEXT_MAX_LENGTH}`,
    )
    .min(
      CommunityPostConstant.COMMUNITY_POST_TEXT_MIN_LENGTH,
      `post title max length is ${CommunityPostConstant.COMMUNITY_POST_TEXT_MIN_LENGTH}`,
    ),
});

export const CommunityPostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
  postQuizDetailsValidationSchema,
};
