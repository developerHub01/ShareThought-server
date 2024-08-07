import { NextFunction, Request, Response } from "express";
import config from "../config";
import catchAsync from "../utils/catch.async";
import { Constatnt } from "../constants/constants";
import { IRequestWithActiveDetails } from "../interface/interface";
import { AuthUtils } from "../modules/auth/auth.utils";
import { GuestUserModel } from "../modules/guest/model/model";

/*
 *
 * This is not for blocking or filtering
 * It just check that if user logged in or not
 * and add userId in req
 *
 */

const createGuestUserIfNeed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req?.cookies[Constatnt.TOKENS.ACCESS_TOKEN];

    if (accessToken) {
      const { userId } = AuthUtils.verifyToken(
        accessToken,
        config.JWT_SECRET as string,
      );

      if (userId) return next();
    }

    let guestToken = req?.cookies[Constatnt.TOKENS.GUEST_TOKEN];

    if (!guestToken) {
      const guestUser = await GuestUserModel.createGuestUser();

      if (guestUser) {
        const { _id } = guestUser as { _id: string };

        guestToken = AuthUtils.createToken(
          { guestId: _id.toString() },
          config?.JWT_SECRET as string,
        );
      }
    }

    let guestId;
    if (guestToken)
      guestId = AuthUtils.verifyToken(
        guestToken,
        config.JWT_SECRET as string,
      )?.guestId;

    if (!guestId) return next();

    const isUserExist = await GuestUserModel.isUserExist(guestId);

    if (!isUserExist) return next();

    res.cookie(Constatnt.TOKENS.GUEST_TOKEN, guestToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });

    (req as IRequestWithActiveDetails).guestId = guestId;

    next();
  },
);

export default createGuestUserIfNeed;
