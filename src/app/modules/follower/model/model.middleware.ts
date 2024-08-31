import httpStatus from "http-status";
import { FollowerModel } from "./model";
import followerSchema from "./model.schema";
import AppError from "../../../errors/AppError";

followerSchema.pre("save", async function (next) {
  const result = await FollowerModel.findOne({
    channelId: this.channelId,
    userId: this.userId,
  });

  if (!result) return next();

  throw new AppError(httpStatus.NOT_ACCEPTABLE, "Already following");
});
