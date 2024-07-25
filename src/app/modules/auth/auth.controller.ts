import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { AuthServices } from "./auth.services";
import AppError from "../../errors/AppError";
import { sendResponse } from "../../utils/send.response";

const loginUser = catchAsync(async (req, res) => {
  const accessToken = await AuthServices.loginUser(req.body);
  if (!accessToken)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong",
    );

  res.cookie("access_token", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

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
  res.clearCookie("access_token");
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
