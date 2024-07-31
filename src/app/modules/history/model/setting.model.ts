import { model } from "mongoose";
import { HistoryConstant } from "../history.constant";
import {
  IHistorySetting,
  IHistorySettingModel,
} from "../history.setting.interface";

/* history setting schema start ================= */
import historySettingSchema from "./setting.method.schema";
/* history setting schema end ================= */

/* history setting schema middleware start ================= */
import "./setting.model.middleware";
/* history setting schema middleware end ================= */

/* history setting schema static methods start ================= */
import "./setting.model.static.method";
/* history setting schema static methods end ================= */

export const HistorySettingModel = model<IHistorySetting, IHistorySettingModel>(
  HistoryConstant.HISTORY_SETTING_COLLECTION_NAME,
  historySettingSchema,
);
