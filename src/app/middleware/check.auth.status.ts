import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import { UserModel } from "../modules/user/user.model";
import catchAsync from "../utils/catch.async";
import { IRequestWithUserId } from "../interface/interface";


/* 
*
* This is not for blocking or filtering 
* It just check that if user logged in or not 
* and add userId in req
*
*/

const checkAuthStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.cookies?.access_token;

    if (!token) return next();

    const { userId } = AuthUtils.verifyToken(
      token,
      config.JWT_SECRET as string,
    );

    if (!userId) return next();

    const isUserExist = await UserModel.isUserExist(userId);

    if (!isUserExist) return next();

    (req as IRequestWithUserId).userId = userId;

    next();
  },
);

export default checkAuthStatus;
