import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { ChannelModel } from "../modules/channel/model/model";

const isValidChannel = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;

  const isChannelExist = await ChannelModel.isChannelExist({ id: channelId });

  if (!isChannelExist)
    throw new AppError(httpStatus.NOT_FOUND, "channel not found");

  return next();
});

export default isValidChannel;
