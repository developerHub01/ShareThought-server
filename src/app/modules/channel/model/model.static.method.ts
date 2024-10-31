import channelSchema from "./model.schema";
import { ChannelModel } from "./model";

// is channel exist
channelSchema.statics.isChannelExist = async ({ id }: { id: string }) => {
  return Boolean(await ChannelModel.findById(id));
};

// is that my channel or not
channelSchema.statics.isChannelMine = async ({
  channelId,
  authorId,
}: {
  channelId: string;
  authorId: string;
}) => {
  return Boolean(
    await ChannelModel.findOne({
      _id: channelId,
      authorId,
    }),
  );
};
