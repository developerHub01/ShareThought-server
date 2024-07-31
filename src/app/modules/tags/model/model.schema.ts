import { Schema } from "mongoose";
import { ITag, ITagModel } from "../tags.interface";

const tagSchema = new Schema<ITag, ITagModel>({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
});

export default tagSchema;
