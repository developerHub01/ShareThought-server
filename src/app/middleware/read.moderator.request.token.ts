import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { IRequestWithActiveDetails } from "../interface/interface";
import catchAsync from "../utils/catch.async";
import { AuthUtils } from "../modules/auth/auth.utils";
import config from "../config";

const readModeratorRequestToken = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  if (!token) throw new AppError(httpStatus.BAD_REQUEST, "token is missing");

  const tokenData = AuthUtils.verifyToken({
    token: token as string,
    secret: config.JWT_MODERATOR_REQUEST_SECRET,
    errorDetails: {
      statusCode: httpStatus.UNAUTHORIZED,
      message: "this is not a valid token",
    },
  });

  if (!tokenData)
    throw new AppError(httpStatus.BAD_REQUEST, "Token data is not valid");

  const { moderatorId } = tokenData as { moderatorId: string };

  if (!moderatorId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "token credentials are not valid",
    );

  (req as IRequestWithActiveDetails).moderatorId = tokenData.moderatorId;

  return next();
});

export default readModeratorRequestToken;
