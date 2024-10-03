import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { Constatnt } from "../constants/constants";
import { ChannelModel } from "../modules/channel/model/model";

/*
 *
 * This is not for blocking or filtering
 * It just check that if any channel activated or not
 * and add channelId in req
 *
 */

const checkChannelStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.cookies[Constatnt.TOKENS.CHANNEL_TOKEN];

    if (!token) return next();

    const { channelId } = AuthUtils.verifyToken(
      token,
      config.JWT_ACCESS_SECRET as string,
    );

    if (!channelId) return next();

    const isChannelExist = await ChannelModel.isChannelExist(channelId);

    if (!isChannelExist) return next();

    (req as IRequestWithActiveDetails).channelId = channelId;

    next();
  },
);

export default checkChannelStatus;
