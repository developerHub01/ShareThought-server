import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { UserModel } from "../modules/user/model/model";
import { IRequestWithActiveDetails } from "../interface/interface";

const isVerified = catchAsync(async (req, res, next) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await UserModel.isVerified({ id: userId });

  if (!result)
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not verfied");

  (req as IRequestWithActiveDetails).isVerified = true;

  return next();
});

export default isVerified;
