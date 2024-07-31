import { model } from "mongoose";
import { IUser, IUserModel } from "../user.interface";
import { UserConstant } from "../user.constant";

/* user schema start ================= */
import userSchema from "./model.schema";
/* user schema end ================= */

/* user schema middleware start ================= */
import "./model.middleware";
/* user schema middleware end ================= */

/* user schema static methods start ================= */
import "./model.static.method";
/* user schema static methods end ================= */

export const UserModel = model<IUser, IUserModel>(
  UserConstant.USER_COLLECTION_NAME,
  userSchema,
);
