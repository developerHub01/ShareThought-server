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

    if (req.body.tags) {
      const tags = JSON.parse(req?.body?.tags);

      if (Array.isArray(tags)) req.body.tags = Array.from(new Set([...tags]));
    }

    next();
  },
);

const isValidTags = catchAsync(async (req, res, next) => {
  const { tags } = req.body;

  tags.forEach((tag: string, index: number) => {
    tag = tag.trim();
    if (tag.split(" ").length > 1)
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
