import { IRequestWithActiveDetails } from "./../interface/interface";
import { Details } from "./../../../node_modules/@types/express-useragent/index.d";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch.async";
import { getIPDetails } from "../utils/utils";
import { IUserLoginInfo } from "../interface/interface";

const getLoginInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { platform: device, browser } = req.useragent as Details;
    const ip = (req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress) as string;
    const userLoginInfo: IUserLoginInfo = {
      device,
      browser,
      ip,
      userLocation: await getIPDetails(ip as string),
    };

    (req as IRequestWithActiveDetails).userLoginInfo = userLoginInfo;

    next();
  },
);

export default getLoginInfo;
