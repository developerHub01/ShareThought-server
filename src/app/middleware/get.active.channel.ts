import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { ChannelModel } from "../modules/channel/model/model";
import { Constatnt } from "../constants/constants";
import { IRequestWithActiveDetails } from "../interface/interface";

const getActiveChannel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[Constatnt.TOKENS.CHANNEL_TOKEN];

    if (!token)
      throw new AppError(httpStatus.UNAUTHORIZED, "no channel activated");

    const { channelId } = AuthUtils.verifyToken(
      token,
      config.JWT_CHANNEL_ACCESS_SECRET as string,
    );

    const isChannelExist = await ChannelModel.isChannelExist(channelId);

    if (!channelId || !isChannelExist)
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "this channel is not activated now",
      );

    (req as IRequestWithActiveDetails).channelId = channelId;

    next();
  },
);

export default getActiveChannel;
