import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { UserServices } from "./user.services";
import { IRequestWithActiveDetails } from "../../interface/interface";
import { UserUtils } from "./user.utils";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { UserModel } from "./model/model";
import { UserCache } from "./user.cache";

const getMyDetails = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await UserCache.findUserById(userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user found succesfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserCache.findUserById(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created succesfully",
    data: result,
  });
});

const findUser = catchAsync(async (req, res) => {
  const result = await UserServices.findUser(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created succesfully",
    data: result,
  });
});

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  delete userData["isVerified"];
  const result = await UserCache.createUser(userData);

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
    const avatarImage = await UserUtils.updateUserAvatar(
      req.body?.avatar,
      CloudinaryConstant.SHARE_THOUGHT_USER_FOLDER_NAME,
      true,
      previousAvatarImage,
    );

    req.body.avatar = avatarImage;
  }

  const result = await UserCache.updateUser(req.body, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user updated succesfully",
    data: result,
  });
});

const updateUserPassword = catchAsync(async (req, res) => {
  const { userId } = req as IRequestWithActiveDetails;

  const result = await UserCache.updateUserPassword(req.body, userId);

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
