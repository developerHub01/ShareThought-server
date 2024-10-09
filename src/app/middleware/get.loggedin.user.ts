import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";

const getLoggedInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as IRequestWithActiveDetails;

    if (!userId)
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in");

    next();
  },
);

export default getLoggedInUser;
