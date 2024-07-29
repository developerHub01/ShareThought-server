import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server error";

  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
