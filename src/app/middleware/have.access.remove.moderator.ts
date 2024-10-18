import AppError from "../errors/AppError";
import httpStatus from "http-status";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";
import { ChannelModel } from "../modules/channel/model/model";
import { ModeratorModel } from "../modules/moderator/model/model";

/**
 *
 * - if user is the author of the channel then he is allowed to remove any types of moderators
 * - if user is not a moderator then throw an error
 * - if user is a moderator of the channel and if have permission to remove moderator means he is SUPER_MODERATOR
 * - if user have no permission modify moderator then he is a NORMAL_MODERATOR
 * - SUPER_MODERATOR only can add or remove NORMAL_MODERATOR
 * - else throw an error
 *
 * ***/

const haveAccessRemoveModerator = catchAsync(async (req, res, next) => {
  const {
    userId,
    channelId,
    moderatorId: myModeratorId,
  } = req as IRequestWithActiveDetails;

  const { moderatorId: moderatorIdToRemove } = req.params;

  const isChannelMine = await ChannelModel.isChannelMine(
    channelId as string,
    userId,
  );

  /* if channel is mine then I have every access */
  if (isChannelMine) return next();

  if (!myModeratorId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You do not have access to modify this channel.",
    );

  if (!moderatorIdToRemove)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Targeted moderator ID is not specified.",
    );

  const [myModeratorData, moderatorToRemoveData] = await Promise.all([
    ModeratorModel.findById(myModeratorId),
    ModeratorModel.findById(moderatorIdToRemove),
  ]);

  if (!myModeratorData)
    throw new AppError(httpStatus.NOT_FOUND, "you are not a valid moderator");

  /* if my moderatorId and my userId doesn't match */
  if (myModeratorData.userId?.toString() !== userId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to perform this action.",
    );

  /* checking that is user a SUPER_MODERATOR or not */
  if (!myModeratorData.permissions.moderator?.canRemove)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to remove moderators.",
    );

  if (!moderatorToRemoveData)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Targeted moderator does not exist.",
    );

  /* checking that is targated user a SUPER_MODERATOR or not */
  if (
    moderatorToRemoveData.permissions.moderator?.add ||
    moderatorToRemoveData.permissions.moderator?.canRemove
  )
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "you are not allowed to remove any SUPER_MODERATOR",
    );

  return next();
});

export default haveAccessRemoveModerator;
