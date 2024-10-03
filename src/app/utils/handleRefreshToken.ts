import httpStatus from "http-status";
import config from "../config";
import { AuthUtils } from "../modules/auth/auth.utils";
import { millisecondsConvert } from "./utils";
import AppError from "../errors/AppError";
import { UserModel } from "../modules/user/model/model";
import { Constatnt } from "../constants/constants";
import { Request, Response } from "express";

const handleRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[Constatnt.TOKENS.REFRESH_TOKEN];
  const { userId } = AuthUtils.verifyToken(
    refreshToken,
    config.JWT_REFRESH_SECRET,
  );

  if (!userId)
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");

  const isUserExist = await UserModel.isUserExist(userId);

  /* if token credentials doesn't match */
  if (!isUserExist)
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");

  const newAccessToken = AuthUtils.createToken(
    {
      userId,
    },
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );

  res.cookie(Constatnt.TOKENS.ACCESS_TOKEN, newAccessToken, {
    secure: !(config.PROJECT_ENVIRONMENT === "development"), // if development environment then false else true
    httpOnly: true,
    sameSite: "none",
    maxAge:
      Number(millisecondsConvert(config.JWT_ACCESS_EXPIRES_IN)) ??
      1000 * 60 * 60 * 24,
  });

  return {
    userId,
  };
};

export default handleRefreshToken;
