import { IForgetPasswordTokenData } from "./../interface/interface";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";

const readForgetPasswordToken = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  if (!token) throw new AppError(httpStatus.BAD_REQUEST, "token is missing");

  const tokenData = AuthUtils.verifyToken({
    token: token as string,
    secret: config.JWT_FORGET_PASSWORD_SECRET,
    errorDetails: {
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Try again",
    },
  });
  const forgetPasswordTokenData: IForgetPasswordTokenData = {
    userId: tokenData.userId,
    email: tokenData.email,
  };

  if (!tokenData)
    throw new AppError(httpStatus.BAD_REQUEST, "Token data is not valid");

  (req as IRequestWithActiveDetails).forgetPasswordTokenData =
    forgetPasswordTokenData;

  return next();
});

export default readForgetPasswordToken;
