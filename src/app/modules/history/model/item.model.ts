import { model } from "mongoose";
import { IHistoryItem, IHistoryItemModel } from "../history.item.interface";
import { HistoryConstant } from "../history.constant";

/* history item schema start ================ */
import historyItemSchema from "./item.mode.schema";
/* history item schema end ================ */

/* history item schema middleware start ================ */
import "./item.model.middleware";
/* history item schema middleware end ================ */

/* history item schema static methods start ================ */
import "./item.model.static.method";
/* history item schema static methods end ================ */

export const HistoryItemModel = model<IHistoryItem, IHistoryItemModel>(
  HistoryConstant.HISTORY_ITEM_COLLECTION_NAME,
  historyItemSchema,
);
