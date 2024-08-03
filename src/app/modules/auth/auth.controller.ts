import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { AuthServices } from "./auth.services";
import AppError from "../../errors/AppError";
import { sendResponse } from "../../utils/send.response";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { AuthUtils } from "./auth.utils";
import { Constatnt } from "../../constants/constants";

const loginUser = catchAsync(async (req, res) => {
  const { guestId } = req as IRequestWithActiveDetails;

  const accessToken = await AuthServices.loginUser(req.body, guestId);

  if (!accessToken)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong",
    );

  res.cookie(Constatnt.TOKENS.ACCESS_TOKEN, accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  /* removing guest token from cookie after new login */
  res.clearCookie(Constatnt.TOKENS.GUEST_TOKEN);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    data: {
      accessToken,
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

export const AuthController = {
  loginUser,
  logoutUser,
};
