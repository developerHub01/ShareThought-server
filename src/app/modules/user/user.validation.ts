import { z as zod } from "zod";

const createUserValidationSchema = zod.object({
  userName: zod
    .string({
      required_error: "Username is required",
    })
    .trim(),
  fullName: zod
    .string({
      required_error: "Full name is required",
    })
    .trim(),
  avatar: zod
    .string({
      required_error: "Avatar is required",
    })
    .trim()
    .optional(),
  email: zod
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email(),
  password: zod
    .string({
      required_error: "password is required",
    })
    .trim(),
});

const updateUserValidationSchema = zod.object({
  userName: zod.string().trim().optional(),
  fullName: zod.string().trim().optional(),
  avatar: zod.string().trim().optional().optional(),
  email: zod.string().trim().email().optional(),
  password: zod.string().optional(),
});

const updateUserPasswordValidationSchema = zod.object({
  oldPassword: zod.string({
    required_error: "old password is required",
  }),
  newPassword: zod.string({
    required_error: "new password is required",
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateUserPasswordValidationSchema,
};
