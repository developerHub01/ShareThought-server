import { model } from "mongoose";
import { ModeratorConstant } from "../moderator.constant";
import { IModerator, IModeratorModel } from "../moderator.interface";

/* moderator schema start =============== */
import moderatorSchema from "./model.schema";
/* moderator schema end =============== */

/* moderator schema middleware start =============== */
import "./model.middleware";
/* moderator schema middleware end =============== */

/* moderator schema static methods start =============== */
import "./model.static.method";
/* moderator schema static methods end =============== */

export const ModeratorModel = model<IModerator, IModeratorModel>(
  ModeratorConstant.MODERATOR_COLLECTION_NAME,
  moderatorSchema,
);
