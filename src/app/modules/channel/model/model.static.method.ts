import { ChannelModel } from "./model";
import channelSchema from "./model.schema";

// is channel exist
channelSchema.statics.isChannelExist = async (id: string) => {
  return Boolean(await ChannelModel.findById(id));
};

// is that my channel or not
channelSchema.statics.isChannelMine = async (
  channelId: string,
  authorId: string,
) => {
  return Boolean(
    await ChannelModel.findOne({
      _id: channelId,
      authorId,
    }),
  );
};
