import catchAsync from "../../utils/catch.async";
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

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    if (Array.isArray(req.body?.channelAvatar))
      req.body.channelAvatar = req.body.channelAvatar[0];

    if (Array.isArray(req.body?.channelCover))
      req.body.channelCover = req.body.channelCover[0];

    next();
  },
);

export const ChannelMiddleware = {
  updateChannelImages,
  matchReqBodyFilesWithValidationSchema,
};
