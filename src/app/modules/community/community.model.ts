import { model, Schema } from "mongoose";
import { ICommunity, ICommunityModel } from "./community.interface";
import { CommunityConstant } from "./community.constant";

const communitySchema = new Schema<ICommunity, ICommunityModel>({});

export const CommunityModel = model<ICommunity, ICommunityModel>(
  CommunityConstant.COMMUNITY_COLLECTION_NAME,
  communitySchema,
);
