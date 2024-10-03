import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../utils/catch.async";

export const validateRequest = (schema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      ...req.body,
    });

    next();
  });
