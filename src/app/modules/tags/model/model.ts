import {  model } from "mongoose";
import { ITag, ITagModel } from "../tags.interface";
import { TagsConstant } from "../tags.constant";

/* tag schema start ============== */
import tagSchema from "./model.schema";
/* tag schema end ============== */

/* tag schema middleware start ============== */
import "./model.middleware"
/* tag schema middleware end ============== */

/* tag schema static methods start ============== */
import "./model.static.method"
/* tag schema static methods end ============== */


export const TagModel = model<ITag, ITagModel>(TagsConstant.TAGS_COLLECTION_NAME, tagSchema);
