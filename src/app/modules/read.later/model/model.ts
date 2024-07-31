import { model } from "mongoose";
import { IReadLater, IReadLaterModel } from "../read.later.interface";
import { ReadLaterConstant } from "../read.later.constant";

/* read later schema start ======================= */
import readLaterSchema from "./model.schema";
/* read later schema end ======================= */

/* read later schema middleware start ======================= */
import "./model.middleware";
/* read later schema middleware end ======================= */

/* read later schema static method start ======================= */
import "./model.static.method";
/* read later schema static method end ======================= */

export const ReadLaterModel = model<IReadLater, IReadLaterModel>(
  ReadLaterConstant.READ_LATER_COLLECTION_NAME,
  readLaterSchema,
);
