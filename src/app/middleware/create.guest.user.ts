import { NextFunction, Request, Response } from "express";
import config from "../config";
import catchAsync from "../utils/catch.async";
import { Constatnt } from "../constants/constants";
import { IRequestWithActiveDetails } from "../interface/interface";
import { AuthUtils } from "../modules/auth/auth.utils";
import { GuestUserModel } from "../modules/guest/model/model";
import { UserModel } from "../modules/user/model/model";
import { millisecondsConvert } from "../utils/utils";

/*
 *
 * This is not for blocking or filtering
 * It just check that if user logged in or not
 * and add userId in req
 *
 */

const createGuestToken = async () => {
  const guestUser = await GuestUserModel.createGuestUser();
  if (!guestUser) return null;

  const { _id } = guestUser as { _id: string };
  const guestToken = AuthUtils.createToken(
    { guestId: _id.toString() },
    config.JWT_GUEST_SECRET as string,
  );

  return guestToken;
};

const validateAccessToken = (accessToken: string | undefined) => {
  if (!accessToken) return null;
  try {
    const { userId } = AuthUtils.verifyToken(
      accessToken,
      config.JWT_ACCESS_SECRET as string,
    );
    return userId;
  } catch (error) {
    return null;
  }
};

const refreshAccessTokenIfValid = async (refreshToken: string) => {
  try {
    const { userId } = AuthUtils.verifyToken(
      refreshToken,
      config.JWT_REFRESH_SECRET,
    );
    const isUserExist = await UserModel.isUserExist(userId);

    if (!isUserExist) return null;

    const newAccessToken = AuthUtils.createToken(
      { userId },
      config.JWT_ACCESS_SECRET,
      config.JWT_ACCESS_EXPIRES_IN,
    );

    return { userId, newAccessToken };
  } catch (error) {
    return null;
  }
};

const createGuestUserIfNeed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[Constatnt.TOKENS.ACCESS_TOKEN];
    const refreshToken = req.cookies[Constatnt.TOKENS.REFRESH_TOKEN];
    let guestToken = req.cookies[Constatnt.TOKENS.GUEST_TOKEN];

    let userId = validateAccessToken(accessToken);

    // 1. Handle refresh token if access token is invalid
    if (!userId && refreshToken) {
      const refreshResult = await refreshAccessTokenIfValid(refreshToken);
      if (refreshResult) {
        userId = refreshResult.userId;

        // Set new access token in cookie
        res.cookie(
          Constatnt.TOKENS.ACCESS_TOKEN,
          refreshResult.newAccessToken,
          {
            secure: !(config.PROJECT_ENVIRONMENT === "development"),
            httpOnly: true,
            sameSite: "none",
            maxAge:
              Number(millisecondsConvert(config.JWT_ACCESS_EXPIRES_IN)) ??
              1000 * 60 * 60 * 24,
          },
        );

        // Clear guest token if user access/refresh token is valid
        res.clearCookie(Constatnt.TOKENS.GUEST_TOKEN);
      } else {
        // Clear invalid tokens if refresh token is invalid
        res.clearCookie(Constatnt.TOKENS.ACCESS_TOKEN);
        res.clearCookie(Constatnt.TOKENS.REFRESH_TOKEN);
      }
    }

    // 2. If valid user token exists, clear guest token and move on
    if (userId) {
      res.clearCookie(Constatnt.TOKENS.GUEST_TOKEN);
      // Attach userId to the request object
      (req as IRequestWithActiveDetails).userId = userId;
      return next();
    }

    // 3. Handle guest token creation if no valid user token exists
    let guestId;
    if (guestToken) {
      try {
        guestId = AuthUtils.verifyToken(
          guestToken,
          config.JWT_GUEST_SECRET as string,
        )?.guestId;
      } catch {
        guestId = null;
      }
    }

    if (!guestId) {
      guestToken = await createGuestToken();
      if (guestToken) {
        guestId = AuthUtils.verifyToken(
          guestToken,
          config.JWT_GUEST_SECRET as string,
        )?.guestId;

        // Set new guest token in cookie
        res.cookie(Constatnt.TOKENS.GUEST_TOKEN, guestToken, {
          secure: config.PROJECT_ENVIRONMENT !== "development", // if development environment then false else true
          httpOnly: true,
          sameSite:
            config.PROJECT_ENVIRONMENT === "development" ? "lax" : "none",
        });

        // Clear any other tokens if only guest token is valid
        res.clearCookie(Constatnt.TOKENS.ACCESS_TOKEN);
        res.clearCookie(Constatnt.TOKENS.REFRESH_TOKEN);
      }
    }

    if (!guestId) return next();

    // 4. Validate guest user existence
    const isGuestUserExist = await GuestUserModel.isUserExist(guestId);
    if (!isGuestUserExist) return next();

    // Attach guestId to the request object
    (req as IRequestWithActiveDetails).guestId = guestId;

    return next();
  },
);

export default createGuestUserIfNeed;
