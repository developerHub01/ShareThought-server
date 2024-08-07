import { TGender } from "../../../interface/interface";
import { IUser } from "../user.interface";
import { UserUtils } from "../user.utils";
import { UserModel } from "./model";
import userSchema from "./model.schema";

// this is for generating avatar if not given.
userSchema.pre<IUser>("save", async function (next) {
  if (this?.avatar) return next();

  this.avatar = UserUtils.generateAvatarURL(
    this.gender as TGender,
    this.userName,
  );

  this.password = await UserModel.createHash(this?.password);

  next();
});
// remove password after saving
userSchema.post("save", function (doc, next) {
  (doc.password as unknown) = undefined;
  next();
});
