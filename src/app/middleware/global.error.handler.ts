import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { CommonErrorConverter } from "../errors/CommonErrorConverter";
import { IErrorSource, IGeneralErrorDetails } from "../interface/error";
import config from "../config";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  const statusCode = error.statusCode || 500;
  const message = "Something went wrong !";

  const stackInfo =
    config.PROJECT_ENVIRONMENT === "development"
      ? {
          stack: error?.stack,
        }
      : {};

  const errorSources: Array<IErrorSource> = [
    {
      path: "",
      message: "Server error",
    },
  ];

  let errorDetails: IGeneralErrorDetails = {
    statusCode,
    message,
    errorSources,
  };

  if (error instanceof ZodError)
    errorDetails = CommonErrorConverter.zodError(error, errorDetails);
  else if (error.name === "ValidationError")
    errorDetails = CommonErrorConverter.mongooseError(error, errorDetails);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...errorDetails,
    ...stackInfo,
  });
};
