import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TGender } from "../../../interface/interface";
import { IUser } from "../user.interface";
import { UserUtils } from "../user.utils";
import { UserModel } from "./model";
import userSchema from "./model.schema";

// this is for generating avatar if not given.
userSchema.pre<IUser>("save", async function (next) {
  if (this.userName?.trim()?.split(" ")?.length > 1)
    throw new AppError(httpStatus.BAD_REQUEST, "userName can't contain spaces");

  if (!this?.avatar)
    this.avatar = UserUtils.generateAvatarURL(
      this.gender as TGender,
      this.userName,
    );

  this.password = await UserModel.createHash(this?.password);

  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IUser>;

  if (update?.userName && update.userName?.trim()?.split(" ")?.length > 1)
    throw new AppError(httpStatus.BAD_REQUEST, "userName can't contain spaces");

  if (update.password) {
    update.password = await UserModel.createHash(update.password);
  }

  next();
});

// remove password after saving
userSchema.post("save", function (doc, next) {
  (doc.password as unknown) = undefined;
  next();
});
