import { ZodError } from "zod";
import {
  IErrorSource,
  IGeneralErrorDetails,
  TMongooseDuplcateError,
} from "../interface/error";
import httpStatus from "http-status";
import mongoose from "mongoose";

const zodError = (
  error: ZodError,
  errorDetails: IGeneralErrorDetails,
): IGeneralErrorDetails => {
  const { issues } = error;

  errorDetails.statusCode = httpStatus.BAD_REQUEST;
  errorDetails.message = "validation error";

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

  errorDetails.statusCode = httpStatus.BAD_REQUEST;
  errorDetails.message = "validation error";

  const otherErrorSources: Array<IErrorSource> = Object.keys(errors)?.map(
    (singleError) => ({
      path: errors[singleError]?.path,
      message: errors[singleError]?.message,
    }),
  );

  if (otherErrorSources?.length) errorDetails.errorSources = otherErrorSources;

  return errorDetails;
};

const mongooseCastError = (
  error: mongoose.Error.CastError,
  errorDetails: IGeneralErrorDetails,
): IGeneralErrorDetails => {
  errorDetails.statusCode = httpStatus.BAD_REQUEST;
  errorDetails.message = "invalid ID";

  const otherErrorSources: Array<IErrorSource> = [
    {
      path: error.path,
      message: error.message,
    },
  ];

  if (otherErrorSources?.length) errorDetails.errorSources = otherErrorSources;

  return errorDetails;
};

const mongooseDuplcateError = (
  error: TMongooseDuplcateError,
  errorDetails: IGeneralErrorDetails,
): IGeneralErrorDetails => {
  errorDetails.statusCode = httpStatus.BAD_REQUEST;
  errorDetails.message = "duplicate error";

  const otherErrorSources: Array<IErrorSource> = Object.keys(
    error?.keyValue,
  )?.map((key) => ({
    path: key,
    message: `${error.keyValue[key]} is already exist`,
  }));

  if (otherErrorSources?.length) errorDetails.errorSources = otherErrorSources;

  return errorDetails;
};

export const CommonErrorConverter = {
  zodError,
  mongooseError,
  mongooseCastError,
  mongooseDuplcateError,
};
