import { model } from "mongoose";
import { ISearchHistory, ISearchHistoryModel } from "../search.history.interface";
import { SearchHistoryConstant } from "../search.history.constant";

/* search history schema start =============== */
import searchHistorySchema from "./model.schema";
/* search history schema end =============== */

/* search history schema middleware start =============== */
import "./model.middleare"
/* search history schema middlware end =============== */

/* search history schema static methods start =============== */
import "./model.static.method";
/* search history schema static methods end =============== */


export const SearchHistoryModel = model<ISearchHistory, ISearchHistoryModel>(
  SearchHistoryConstant.SEARCH_HISTORY_COLLECTION_NAME,
  searchHistorySchema,
);
