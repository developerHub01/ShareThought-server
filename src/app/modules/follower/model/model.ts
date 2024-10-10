import { model } from "mongoose";
import { IFollower, IFollowerModel } from "../follower.interface";
import { FollowerConstant } from "../follower.constant";

/* follower schema start =============== */
import followerSchema from "./model.schema";
/* follower schema end =============== */

/* follower schema middleware start =============== */
import "./model.middleware";
/* follower schema middleware end =============== */

/* follower schema static methods start =============== */
import "./model.static.method";
/* follower schema static methods end =============== */

export const FollowerModel = model<IFollower, IFollowerModel>(
  FollowerConstant.FOLLOWER_COLLECTION_NAME,
  followerSchema,
);
