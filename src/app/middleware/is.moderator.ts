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
import AppError from "../errors/AppError";
import httpStatus from "http-status";

/*
 *
 * - this will check that is the user it a moderator or not
 * - if moderator then add moderator permissions in request
 * - else throw and error that user is not a moderator
 *
 */

const isModerator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.cookies[Constatnt.TOKENS.MODERATOR_TOKEN];

    if (!token)
      throw new AppError(httpStatus.UNAUTHORIZED, "user is not a moderator");

    const { moderatorId } = AuthUtils.verifyToken(
      token,
      config.JWT_MODERATOR_SECRET as string,
    );

    if (!moderatorId)
      throw new AppError(httpStatus.UNAUTHORIZED, "user is not a moderator");

    const moderatorData = (await ModeratorModel.findById(
      moderatorId,
    )) as TDocumentType<IModerator>;

    if (!moderatorData) throw new AppError(httpStatus.NOT_FOUND, "this moderator not found");

    (req as IRequestWithActiveDetails).moderatorId = moderatorId;
    (req as IRequestWithActiveDetails).moderatorPermissions =
      moderatorData.permissions;

    next();
  },
);

export default isModerator;
