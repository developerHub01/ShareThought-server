import { Schema } from "mongoose";
import { IGuestUser, IGuestUserModel } from "../guest.user.user.interface";

const guestUserSchema = new Schema<IGuestUser, IGuestUserModel>(
  {},
  {
    versionKey: false,
  },
);

export default guestUserSchema;
