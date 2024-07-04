import { ChannelModel } from "./../modules/channel/channel.model";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catch.async";

const channelExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await ChannelModel.isChannelExist(id);
  
  if (!result) throw new AppError(httpStatus.NOT_FOUND, "No channel found");

  return next();
});

export default channelExist;
