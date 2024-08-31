import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { CommonErrorConverter } from "../errors/CommonErrorConverter";
import { IErrorSource, IGeneralErrorDetails } from "../interface/error";
import config from "../config";
import AppError from "../errors/AppError";

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
  else if (error.name === "CastError")
    errorDetails = CommonErrorConverter.mongooseCastError(error, errorDetails);
  else if (error.code === 11000)
    errorDetails = CommonErrorConverter.mongooseDuplcateError(
      error,
      errorDetails,
    );
  else if (error instanceof AppError) {
    errorDetails.statusCode = error.statusCode;
    errorDetails.message = error?.message;
    errorDetails.errorSources = [
      {
        path: "",
        message: error?.message,
      },
    ];
  } else if (error instanceof Error) {
    errorDetails.message = error?.message;
    errorDetails.errorSources = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }

  error.statusCode = errorDetails.statusCode;

  return res.status(error.statusCode).json({
    success: false,
    statusCode,
    message,
    ...errorDetails,
    ...stackInfo,
  });
};
