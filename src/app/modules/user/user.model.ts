import { Schema, model } from "mongoose";
import { IUser, IUserChangePassword, IUserModel } from "./user.interface";
import { UserUtils } from "./user.utils";
import bcrypt from "bcrypt";
import config from "../../config";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import errorHandler from "../../errors/errorHandler";

const userSchema = new Schema<IUser, IUserModel>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["male", "female"],
    },
    avatar: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// this is for generating avatar if not given.
userSchema.pre("save", async function (next) {
  if (this?.avatar) return next();
  this.avatar = UserUtils.generateAvatarURL(this.gender, this.userName);
  
  this.password = await UserModel.createHash(this?.password);

  next();
});
// remove password after saving
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.createHash = async (str: string) => {
  return await bcrypt.hash(str, Number(config?.BCRYPT_SALT_ROUND));
};

userSchema.statics.isPasswordMatch = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
userSchema.statics.isUserExist = async (id: string) => {
  return await UserModel.findById(id);
};
userSchema.statics.changePassword = async (
  payload: IUserChangePassword,
  userId: string,
) => {
  const { oldPassword, newPassword } = payload;

  try {
    // finding user by id
    const userData = await UserModel.findById(userId).select("password");

    if (!userData) throw new AppError(httpStatus.NOT_FOUND, "user not found");

    const { password: userPassword } = userData as typeof userData & {
      password: string;
    };

    // checking that user password and my old password are same or not
    const isPasswordMatched = await UserModel.isPasswordMatch(
      oldPassword,
      userPassword,
    );

    if (!isPasswordMatched)
      throw new AppError(httpStatus.UNAUTHORIZED, "password not matched");

    // update user password by new password
    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        // creating new password and replacing
        password: await UserModel.createHash(newPassword),
      },
      {
        new: true,
      },
    );

    if (!result)
      throw new AppError(Number(httpStatus[500]), "password couldn't change");

    return result;
  } catch (error) {
    return errorHandler(error);
  }
};

export const UserModel = model<IUser, IUserModel>("User", userSchema);
