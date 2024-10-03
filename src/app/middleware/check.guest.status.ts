import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { UserModel } from "../modules/user/model/model";
import { Constatnt } from "../constants/constants";

/*
 *
 * This is not for blocking or filtering
 * It just check that if user logged in or not
 * and add userId in req
 *
 */

const checkGuestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const guestToken = req?.cookies[Constatnt.TOKENS.GUEST_TOKEN];

    if (!guestToken) return next();

    const { guestId } = AuthUtils.verifyToken(
      guestToken,
      config.JWT_GUEST_SECRET as string,
    );

    if (!guestId) return next();

    const isUserExist = await UserModel.isUserExist(guestId);

    if (!isUserExist) return next();

    (req as IRequestWithActiveDetails).guestId = guestId;

    next();
  },
);

export default checkGuestStatus;
