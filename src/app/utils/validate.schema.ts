import { AnyZodObject } from "zod";

export const validateSchema = async (
  schema: AnyZodObject,
  data: Record<string, unknown>,
) => {
  await schema.parseAsync({
    ...data,
  });
};
