import { model } from "mongoose";
import { IGuestUser, IGuestUserModel } from "../guest.user.user.interface";
import { GuestUserConstant } from "../guest.user.constant";

/* guest user schema start =========== */
import guestUserSchema from "./model.schema";
/* guest user schema end =========== */

/* guest user schema middleware start =========== */
import "./model.middleware";
/* guest user schema middleware end =========== */

/* guest user schema static method start =========== */
import "./model.static.method";
/* guest user schema static method end =========== */

export const GuestUserModel = model<IGuestUser, IGuestUserModel>(
  GuestUserConstant.GUEST_USER_COLLECTION_NAME,
  guestUserSchema,
);
