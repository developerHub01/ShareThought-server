import { z as zod } from "zod";
import { Constant } from "../../constants/constants";

const createChannelValidationSchema = zod.object({
  channelName: zod
    .string({
      required_error: "Channel name is required",
    })
    .trim()
    .max(
      Constant.CHANNEL_NAME_MAX_LENGTH,
      `Channel name maximum length is ${Constant.CHANNEL_NAME_MAX_LENGTH}`,
    )
    .min(
      Constant.CHANNEL_NAME_MIN_LENGTH,
      `Channel name minimum length is ${Constant.CHANNEL_NAME_MIN_LENGTH}`,
    ),
});

const updateChannelValidationSchema = zod.object({
  channelName: zod
    .string()
    .trim()
    .max(
      Constant.CHANNEL_NAME_MAX_LENGTH,
      `Channel name maximum length is ${Constant.CHANNEL_NAME_MAX_LENGTH}`,
    )
    .min(
      Constant.CHANNEL_NAME_MIN_LENGTH,
      `Channel name minimum length is ${Constant.CHANNEL_NAME_MIN_LENGTH}`,
    )
    .optional(),
  channelDescription: zod
    .string()
    .trim()
    .max(
      Constant.CHANNEL_DESCRIPTION_MAX_LENGTH,
      `Channel description maximum length is ${Constant.CHANNEL_DESCRIPTION_MAX_LENGTH}`,
    )
    .trim()
    .optional(),
  channelAvatar: zod.string().trim().optional(),
  channelCover: zod.string().trim().optional(),
});

export const ChannelValidation = {
  createChannelValidationSchema,
  updateChannelValidationSchema,
};
