import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { UserServices } from "./user.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { UserUtils } from "./user.utils";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { UserModel } from "./model/model";
import { UserCache } from "./user.cache";
import { emailQueue } from "../../queues/email/queue";
import { AuthUtils } from "../auth/auth.utils";
import AppError from "../../errors/AppError";
import { QueueJobList } from "../../queues";

const getMyDetails = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await UserCache.findUserById({ userId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user found succesfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id: userId } = req.params;

  const result = await UserCache.findUserById({ userId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user found succesfully",
    data: result,
  });
});

const findUser = catchAsync(async (req, res) => {
  const result = await UserServices.findUser({ query: req.query });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created succesfully",
    data: result,
  });
});

const createUser = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  if (userId)
    throw new AppError(httpStatus.BAD_REQUEST, "you are already loggedin");

  const userData = req.body;
  delete userData["isVerified"];

  const result = await UserCache.createUser(userData);

  const emailData = {
    _id: result._id?.toString(),
    email: result.email,
    fullName: result.fullName,
  };

  await emailQueue.add(QueueJobList.SEND_VERIFICATION_EMAIL, emailData, {
    removeOnComplete: true,
    removeOnFail: true,
  });

  AuthUtils.clearAllCookies({ req, res });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created succesfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const previousAvatarImage = (await UserModel.findById(userId))?.avatar;

  if (req.body?.avatar) {
    const avatarImage = await UserUtils.updateUserAvatar({
      imagePath: req.body?.avatar,
      cloudinaryMediaPath: CloudinaryConstant.SHARE_THOUGHT_USER_FOLDER_NAME,
      isUpdating: true,
      previousImage: previousAvatarImage,
    });

    req.body.avatar = avatarImage;
  }

  const result = await UserCache.updateUser({ payload: req.body, userId });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user updated succesfully",
    data: result,
  });
});

const updateUserPassword = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await UserCache.updateUserPassword({
    payload: req.body,
    userId,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password changed succesfully",
    data: result,
  });
});

export const UserController = {
  getMyDetails,
  getUserById,
  findUser,
  createUser,
  updateUser,
  updateUserPassword,
};
