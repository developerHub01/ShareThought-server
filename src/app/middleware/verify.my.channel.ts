import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { ChannelModel } from "../modules/channel/channel.model";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";

const verifyMyChannel = catchAsync(async (req, res, next) => {
  const { userId, channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "your channel is not activated");

  const result = await ChannelModel.isChannelMine(channelId, userId);

  if (!result)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your channel");

  return next();
});

export default verifyMyChannel;
