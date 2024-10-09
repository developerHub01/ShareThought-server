import { z as zod } from "zod";

const loginValidationSchema = zod.object({
  emailOrUserName: zod
    .string({
      required_error: "Email or Username is required",
    })
    .trim(),
  password: zod
    .string({
      required_error: "Password is required",
    })
    .trim(),
});

const forgotPasswordValidationSchema = zod.object({
  emailOrUserName: zod
    .string({
      required_error: "Email is required",
    })
    .trim()
});

const resetPasswordValidationSchema = zod.object({
  password: zod
    .string({
      required_error: "password is required",
    })
    .trim()
});

export const AuthValidation = {
  loginValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
