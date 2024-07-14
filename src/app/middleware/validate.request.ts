import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileList: Record<string, string[]> = {};

      if (req.file) {
        const fieldName = req?.file?.fieldname;
        (fileList as typeof fileList & Record<string, string[]>)[fieldName] = [
          req.file.path,
        ];
      }

      if (req.files && typeof req.files === "object") {
        Object.keys(req?.files).map((fieldName) => {
          const files = (req.files as Record<string, unknown>)[fieldName];

          if (Array.isArray(files)) {
            const filePaths = files.map(
              (file: Record<string, string>) => file.path,
            );
            fileList[fieldName] = filePaths;
          }
        });
      }

      req.body = {
        ...req.body,
        ...fileList,
      };

      await schema.parseAsync({
        ...req.body,
      });

      next();
    } catch (error) {
      return next(error);
    }
  };
