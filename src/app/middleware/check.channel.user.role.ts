import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catch.async";
import { IRequestWithActiveDetails } from "../interface/interface";

/**
 * - if channelI, userId and moderatorId exist then user is a moderator
 * - else throw following errors
 *    - if userId not exist then user is not logged in
 *    - if channelId is not exist means no channel is activated
 *
 * - if user is moderator then check moderatorPermissions if have moderator add or remove permissions then he is a SUPER_MODERATOR else NORMA_MODERATOR
 * - else user is the AUTHOR of the channel
 * ***/

const checkChannelUserRole = catchAsync(async (req, res, next) => {
  const {
    channelId,
    userId,
    moderatorId,
    moderatorPermissions,
    isVerifiedModerator,
  } = req as IRequestWithActiveDetails;

  if (!userId)
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not logged in");

  if (!channelId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "your channel is not activated",
    );

  if (moderatorId) {
    if (!isVerifiedModerator)
      throw new AppError(
        httpStatus.FORBIDDEN,
        "you are not verified moderator. please accept the moderation request",
      );

    (req as IRequestWithActiveDetails).channelRole =
      moderatorPermissions?.moderator?.add ||
      moderatorPermissions?.moderator?.canRemove ||
      moderatorPermissions?.moderator?.update
        ? "SUPER_MODERATOR"
        : "NORMAL_MODERATOR";

    return next();
  }

  (req as IRequestWithActiveDetails).channelRole = "AUTHOR";

  if (!moderatorId) return next();
});

export default checkChannelUserRole;
