import { z as zod } from "zod";

const loginValidationSchema = zod.object({
  email: zod
    .string({
      required_error: "Email is required",
    })
    .trim(),
  password: zod
    .string({
      required_error: "password is required",
    })
    .trim(),
});

export const AuthValidation = {
  loginValidationSchema,
};
