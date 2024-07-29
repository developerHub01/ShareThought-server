import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";

const createOrUpdatePostImages = imageUpload.fields([
  {
    name: "banner",
    maxCount: 1,
  },
]);

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    let bannerPath;

    if (req?.body?.banner?.length) bannerPath = req?.body?.banner[0];

    if (bannerPath) req.body.banner = bannerPath;
    
    next();
  },
);

export const PostMiddleware = {
  createOrUpdatePostImages,
  matchReqBodyFilesWithValidationSchema,
};
