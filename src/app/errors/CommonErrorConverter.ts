import { ZodError } from "zod";
import { IErrorSource, IGeneralErrorDetails } from "../interface/error";
import httpStatus from "http-status";
import mongoose from "mongoose";

const zodError = (
  error: ZodError,
  errorDetails: IGeneralErrorDetails,
): IGeneralErrorDetails => {
  const { issues } = error;

  errorDetails.statusCode = httpStatus.BAD_REQUEST;
  errorDetails.message = "validation failed";

  const otherErrorSources: Array<IErrorSource> = issues?.map((issue) => ({
    path: issue?.path?.pop() || "",
    message: issue?.message,
  }));

  if (otherErrorSources?.length) errorDetails.errorSources = otherErrorSources;

  return errorDetails;
};

const mongooseError = (
  error: mongoose.Error.ValidationError,
  errorDetails: IGeneralErrorDetails,
): IGeneralErrorDetails => {
  const { errors } = error;

  const otherErrorSources: Array<IErrorSource> = Object.keys(errors)?.map(
    (singleError) => ({
      path: errors[singleError]?.path,
      message: errors[singleError]?.message,
    }),
  );

  if (otherErrorSources?.length) errorDetails.errorSources = otherErrorSources;

  return errorDetails;
};

export const CommonErrorConverter = {
  zodError,
  mongooseError,
};
