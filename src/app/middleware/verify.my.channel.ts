import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { ChannelModel } from "../modules/channel/channel.model";
import catchAsync from "../utils/catch.async";
import { IRequestWithUserId } from "../interface/interface";

const verifyMyChannel = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req as IRequestWithUserId;

  const result = await ChannelModel.isChannelMine(id, userId);

  if (!result)
    throw new AppError(httpStatus.UNAUTHORIZED, "This is not your channel");

  return next();
});

export default verifyMyChannel;
