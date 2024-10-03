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
  email: zod
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email(),
});

export const AuthValidation = {
  loginValidationSchema,
  forgotPasswordValidationSchema,
};
