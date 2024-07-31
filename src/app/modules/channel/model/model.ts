import { model } from "mongoose";
import { IChannel, IChannelModel } from "../channel.interface";
import { ChannelConstant } from "../channel.constant";

/* channel schema start ================ */
import channelSchema from "./model.schema";
/* channel schema end ================ */

/* channel schema middleware start ================ */
import "./model.middleware"
/* channel schema middleware end ================ */

/* channel schema static method start ================ */
import "./model.static.method"
/* channel schema static method end ================ */


export const ChannelModel = model<IChannel, IChannelModel>(
  ChannelConstant.CHANNEL_COLLECTION_NAME,
  channelSchema,
);
