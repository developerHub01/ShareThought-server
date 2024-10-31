import httpStatus from "http-status";
import { UserModel } from "./model";
import userSchema from "./model.schema";
import bcrypt from "bcrypt";
import config from "../../../config";
import { IUserChangePassword } from "../user.interface";
import AppError from "../../../errors/AppError";

userSchema.statics.createHash = async ({
  str,
}: {
  str: string;
}): Promise<string> => {
  return await bcrypt.hash(str, Number(config?.BCRYPT_SALT_ROUND));
};

userSchema.statics.isPasswordMatch = async ({
  plainPassword,
  hashedPassword,
}: {
  plainPassword: string;
  hashedPassword: string;
}): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.statics.isUserExist = async ({
  id,
}: {
  id: string;
}): Promise<boolean> => {
  return Boolean(await UserModel.findById(id));
};

userSchema.statics.isVerified = async ({
  id,
}: {
  id: string;
}): Promise<boolean> => {
  return Boolean((await UserModel.findById(id))?.isVerified);
};

userSchema.statics.updateUserPassword = async ({
  payload,
  userId,
}: {
  payload: IUserChangePassword;
  userId: string;
}): Promise<unknown> => {
  const { oldPassword, newPassword } = payload;

  // finding user by id
  const userData = await UserModel.findById(userId).select("password");

  if (!userData) throw new AppError(httpStatus.NOT_FOUND, "user not found");

  const { password: userPassword } = userData as typeof userData & {
    password: string;
  };

  // checking that user password and my old password are same or not
  const isPasswordMatched = await UserModel.isPasswordMatch({
    plainPassword: oldPassword,
    hashedPassword: userPassword,
  });

  if (!isPasswordMatched)
    throw new AppError(httpStatus.UNAUTHORIZED, "password not matched");

  // update user password by new password
  const result = await UserModel.findByIdAndUpdate(
    userId,
    {
      // creating new password and replacing
      password: await UserModel.createHash({ str: newPassword }),
    },
    {
      new: true,
    },
  );

  if (!result)
    throw new AppError(
      Number(httpStatus.INTERNAL_SERVER_ERROR),
      "password couldn't change",
    );

  return result;
};
