import { model, Schema } from "mongoose";
import { MediaConstant } from "./media.constant";
import { IMedia, IMediaModel } from "./media.interface";

const mediaSchema = new Schema<IMedia, IMediaModel>({});

export const MediaModel = model<IMedia, IMediaModel>(
  MediaConstant.MEDIA_COLLECTION_NAME,
  mediaSchema,
);
