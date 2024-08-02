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
  },
  {
    timestamps: true,
  },
);

export default userSchema;
