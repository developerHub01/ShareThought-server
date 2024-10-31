import { ChannelModel } from "../modules/channel/model/model";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";

const channelExist = catchAsync(async (req, res, next) => {
  const { channelId } = req as IRequestWithActiveDetails;

  if (!channelId)
    throw new AppError(httpStatus.BAD_REQUEST, "your channel is not activated");

  const result = await ChannelModel.isChannelExist({ id: channelId });

  if (!result) throw new AppError(httpStatus.NOT_FOUND, "No channel found");

  return next();
});

export default channelExist;
