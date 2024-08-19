import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";

const createReportImages = imageUpload.fields([
  {
    name: "evidenceImages",
    maxCount: 5,
  },
]);

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    let evidenceImagesPath;

    if (req?.body?.evidenceImages?.length)
      evidenceImagesPath = req?.body?.evidenceImages[0];

    if (evidenceImagesPath) req.body.evidenceImages = evidenceImagesPath;

    next();
  },
);

export const ReportMiddleware = {
  createReportImages,
  matchReqBodyFilesWithValidationSchema,
};
