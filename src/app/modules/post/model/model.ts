import { model } from "mongoose";
import { IPost, IPostModel } from "../post.interface";
import { PostConstant } from "../post.constant";

/* post schema start ================== */
import postSchema from "./model.schema";
/* post schema end ================== */

/* post schema middleware start ================== */
import "./model.middleware"
/* post schema middleware end ================== */

/* post schema static methods start ================== */
import "./model.static.method"
/* post schema static methods end ================== */

export const PostModel = model<IPost, IPostModel>(
  PostConstant.POST_COLLECTION_NAME,
  postSchema,
);
