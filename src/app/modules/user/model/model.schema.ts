import { Schema } from "mongoose";
import { IUser, IUserModel } from "../user.interface";

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

export default userSchema;
