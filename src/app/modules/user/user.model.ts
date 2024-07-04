import { Schema, model } from "mongoose";
import { IUser, IUserModel } from "./user.interface";
import { UserUtils } from "./user.utils";
import bcrypt from "bcrypt";
import config from "../../config";

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

  this.password = await bcrypt.hash(
    this?.password,
    Number(config?.BCRYPT_SALT_ROUND),
  );
  next();
});
// remove password after saving
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isPasswordMatch = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
userSchema.statics.isUserExist = async (id:string) => {
  return await UserModel.findById(id);
};

export const UserModel = model<IUser, IUserModel>("User", userSchema);
