import { z as zod } from "zod";

const followerSchema = zod.object({
  userId: zod
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be string",
    })
    .trim(),
  channelId: zod
    .string({
      required_error: "channelId is required",
      invalid_type_error: "channelId must be string",
    })
    .trim(),
});

export const FollowerValidation = {
  followerSchema,
};
