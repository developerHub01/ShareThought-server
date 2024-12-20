import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";
import catchAsync from "../utils/catch.async";
import {
  IRequestWithActiveDetails,
  TDocumentType,
} from "../interface/interface";
import { Constatnt } from "../constants/constants";
import { ModeratorModel } from "../modules/moderator/model/model";
import { IModerator } from "../modules/moderator/moderator.interface";

/*
 *
 * - this will check that is the user it a moderator or not
 * - if moderator then add moderator permissions in request
 * - else next
 *
 */

const checkModeratorStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.cookies[Constatnt.TOKENS.MODERATOR_TOKEN];
    const { userId } = req as IRequestWithActiveDetails;

    if (!token) return next();

    const { moderatorId } = AuthUtils.verifyToken({
      token,
      secret: config.JWT_MODERATOR_SECRET as string,
    });

    if (!moderatorId) return next();

    const moderatorData = (await ModeratorModel.findById(moderatorId)
      .select("userId isVerified permissions")
      .lean()) as TDocumentType<IModerator>;

    if (!moderatorData || moderatorData?.userId?.toString() !== userId)
      return next();

    (req as IRequestWithActiveDetails).moderatorId = moderatorId;
    (req as IRequestWithActiveDetails).moderatorPermissions =
      moderatorData.permissions;
    (req as IRequestWithActiveDetails).isVerifiedModerator =
      moderatorData.isVerified;

    next();
  },
);

export default checkModeratorStatus;
