import httpStatus from "http-status";
import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";
import AppError from "../../errors/AppError";

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

const isValidTags = catchAsync(async (req, res, next) => {
  const { tags } = req.body;

  tags.forEach((tag: string, index: number) => {
    tag = tag.trim();
    if (tags.split(" ").length)
      throw new AppError(httpStatus.BAD_REQUEST, `${tag} is not a valid`);

    tags[index] = tag;
  });

  next();
});

export const PostMiddleware = {
  createOrUpdatePostImages,
  matchReqBodyFilesWithValidationSchema,
  isValidTags,
};
