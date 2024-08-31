import { ZodError } from "zod";
import { IErrorSource, IGeneralErrorDetails } from "../interface/error";
import httpStatus from "http-status";

const zod = (
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

export const CommonErrorConverter = {
  zod,
};
