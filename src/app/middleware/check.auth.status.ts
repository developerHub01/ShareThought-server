import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { UserModel } from "../modules/user/model/model";
import { Constatnt } from "../constants/constants";
import handleRefreshToken from "../utils/handleRefreshToken";

/*
 *
 * This is not for blocking or filtering
 * It just check that if user logged in or not
 * and add userId in req
 *
 */

const checkAuthStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req?.cookies[Constatnt.TOKENS.ACCESS_TOKEN];
    const refreshToken = req?.cookies[Constatnt.TOKENS.REFRESH_TOKEN];

    /*if there is no refresh token then user must need to login again to access*/

    if (!refreshToken) return next();

    let userId = "";
    if (!accessToken) {
      try {
        const { userId: userIdFromToken } = await handleRefreshToken(req, res);
        userId = userIdFromToken;
      } catch (error) {
        /* menas access token can't create because of invalidation of refresh token */
        return next();
      }
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
        try {
          const { userId: userIdFromRefresh } = await handleRefreshToken(
            req,
            res,
          );
          userId = userIdFromRefresh;
        } catch (error) {
          /* menas access token can't create because of invalidation of refresh token */
          return next();
        }
      }
    }

    // Final check for valid userId
    if (!userId) return next();

    // Attach the userId to the request object
    (req as IRequestWithActiveDetails).userId = userId;

    next();
  },
);

export default checkAuthStatus;
