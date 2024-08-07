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

const checkAuthStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.cookies[Constatnt.TOKENS.ACCESS_TOKEN];

    if (!token) return next();

    const { userId } = AuthUtils.verifyToken(
      token,
      config.JWT_SECRET as string,
    );

    if (!userId) return next();

    const isUserExist = await UserModel.isUserExist(userId);

    if (!isUserExist) return next();

    (req as IRequestWithActiveDetails).userId = userId;

    next();
  },
);

export default checkAuthStatus;
