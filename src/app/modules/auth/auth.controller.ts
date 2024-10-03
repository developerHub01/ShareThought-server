import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { AuthServices } from "./auth.services";
import AppError from "../../errors/AppError";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { AuthUtils } from "./auth.utils";
import { Constatnt } from "../../constants/constants";
import config from "../../config";
import { millisecondsConvert } from "../../utils/utils";

const loginUser = catchAsync(async (req, res) => {
  const { guestId } = req as IRequestWithActiveDetails;

  const { accessToken, refreshToken } = await AuthServices.loginUser(
    req.body,
    guestId,
  );

  if (!accessToken || !refreshToken)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong",
    );

  /* removing guest token from cookie after new login */
  res.clearCookie(Constatnt.TOKENS.GUEST_TOKEN);

  res.cookie(Constatnt.TOKENS.ACCESS_TOKEN, accessToken, {
    secure: !(config.PROJECT_ENVIRONMENT === "development"), // if development environment then false else true
    httpOnly: true,
    sameSite: "none",
    maxAge:
      Number(millisecondsConvert(config.JWT_ACCESS_EXPIRES_IN)) ??
      1000 * 60 * 60 * 24,
  });

  res.cookie(Constatnt.TOKENS.REFRESH_TOKEN, refreshToken, {
    secure: !(config.PROJECT_ENVIRONMENT === "development"), // if development environment then false else true
    httpOnly: true,
    sameSite: "none",
    maxAge:
      Number(millisecondsConvert(config.JWT_REFRESH_EXPIRES_IN)) ??
      1000 * 60 * 60 * 24,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const logoutUser = catchAsync(async (req, res) => {
  AuthUtils.clearAllCookies(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout succesfully",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password forget process started successfully",
    data: null,
  });
});

export const AuthController = {
  loginUser,
  logoutUser,
  forgotPassword,
};
