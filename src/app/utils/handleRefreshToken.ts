import httpStatus from "http-status";
import config from "../config";
import { AuthUtils } from "../modules/auth/auth.utils";
import { millisecondsConvert } from "./utils";
import AppError from "../errors/AppError";
import { UserModel } from "../modules/user/model/model";
import { Constatnt } from "../constants/constants";
import { Request, Response } from "express";

const handleRefreshToken = async (
  req: Request,
  res: Response,
  block: boolean = true,
) => {
  const refreshToken = req.cookies[Constatnt.TOKENS.REFRESH_TOKEN];
  const { userId } = AuthUtils.verifyToken({
    token: refreshToken,
    secret: config.JWT_REFRESH_SECRET,
  });

  if (!userId && block) {
    res.clearCookie(Constatnt.TOKENS.ACCESS_TOKEN);
    res.clearCookie(Constatnt.TOKENS.REFRESH_TOKEN);
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
  }

  const isUserExist = await UserModel.isUserExist(userId);

  /* if token credentials doesn't match */
  if (!isUserExist && block) {
    res.clearCookie(Constatnt.TOKENS.ACCESS_TOKEN);
    res.clearCookie(Constatnt.TOKENS.REFRESH_TOKEN);
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
  }

  const newAccessToken = AuthUtils.createToken({
    jwtPayload: {
      userId,
    },
    secret: config.JWT_ACCESS_SECRET,
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });

  res.cookie(Constatnt.TOKENS.ACCESS_TOKEN, newAccessToken, {
    secure: config.PROJECT_ENVIRONMENT !== "development", // if development environment then false else true
    httpOnly: true,
    sameSite: config.PROJECT_ENVIRONMENT === "development" ? "lax" : "none",
    maxAge:
      Number(millisecondsConvert(config.JWT_ACCESS_EXPIRES_IN)) ??
      1000 * 60 * 60 * 24,
  });

  return {
    userId,
  };
};

export default handleRefreshToken;
