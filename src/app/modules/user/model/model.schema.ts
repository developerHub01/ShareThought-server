import { Schema } from "mongoose";
import { IUser, IUserModel } from "../user.interface";
import { UserConstant } from "../user.constant";

const userSchema = new Schema<IUser, IUserModel>(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: Object.values(UserConstant.GENDER_TYPES),
    },
    avatar: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    needToChangePassword: {
      type: Boolean,
      select: false,
      /* 
      need when forget password. when someone will request for changepassowrd email notification then it will be true

      while changed the password then it will be false or removed so that same token can't use in second time
       */
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default userSchema;
