import { imageUpload } from "../../utils/multer.image.upload";

const updateChannelImages = imageUpload.fields([
  {
    name: "channelCover",
    maxCount: 1,
  },
  {
    name: "channelAvatar",
    maxCount: 1,
  },
]);

export const ChannelMiddleware = { updateChannelImages };
