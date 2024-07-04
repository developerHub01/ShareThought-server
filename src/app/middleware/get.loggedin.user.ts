import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../modules/user/user.model";
import catchAsync from "../utils/catch.async";
import { IRequestWithUserId } from "../interface/interface";

const getLoggedInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    
    const { userId } = AuthUtils.verifyToken(
      token,
      config.JWT_SECRET as string,
    );
    
    const isUserExist = await UserModel.isUserExist(userId);
    
    if (!userId || !isUserExist)
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
    
    (req as IRequestWithUserId).userId = userId;
    
    next();
  },
);

export default getLoggedInUser;
