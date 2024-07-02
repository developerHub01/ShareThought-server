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

export const UserValidation = {
  createUserValidationSchema,
};
