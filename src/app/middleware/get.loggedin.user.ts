import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { Constatnt } from "../constants/constants";
import { UserModel } from "../modules/user/model/model";
import handleRefreshToken from "../utils/handleRefreshToken";

const getLoggedInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[Constatnt.TOKENS.ACCESS_TOKEN];
    const refreshToken = req.cookies[Constatnt.TOKENS.REFRESH_TOKEN];


    /*
     *
     *
     * if there is no refresh token then user must need to login again to access
     *
     *
     * */

    if (!refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
    }

    /*
     *
     *
     * if somehow access token is expired and refresh token is valid then generate new access token and set in cookies
     *
     *
     */
    let userId = "";
    if (!accessToken) {
      const { userId: userIdFromToken } = await handleRefreshToken(req, res);
      userId = userIdFromToken;
    } else {
      try {
        const decodedToken = AuthUtils.verifyToken(
          accessToken,
          config.JWT_ACCESS_SECRET,
        );

        const userIdFromToken = decodedToken["userId"];

        // Check if user exists in the database
        const isUserExist = await UserModel.isUserExist(userIdFromToken);
        if (!isUserExist) throw new Error(); // Force token refresh if the user does not exist

        userId = userIdFromToken;
      } catch (error) {
        // If access token is invalid or expired, refresh it
        const { userId: userIdFromRefresh } = await handleRefreshToken(
          req,
          res,
        );
        userId = userIdFromRefresh;
      }
    }

    // Final check for valid userId
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
    }

    // Attach the userId to the request object
    (req as IRequestWithActiveDetails).userId = userId;

    next();
  },
);

export default getLoggedInUser;
