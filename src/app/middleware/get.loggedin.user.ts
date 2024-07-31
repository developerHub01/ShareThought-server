import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { Constatnt } from "../constants/constants";
import { UserModel } from "../modules/user/model/model";

const getLoggedInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[Constatnt.TOKENS.ACCESS_TOKEN];
    
    const { userId } = AuthUtils.verifyToken(
      token,
      config.JWT_SECRET as string,
    );
    
    const isUserExist = await UserModel.isUserExist(userId);
    
    if (!userId || !isUserExist)
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");
    
    (req as IRequestWithActiveDetails).userId = userId;
    

    next();
  },
);

export default getLoggedInUser;
