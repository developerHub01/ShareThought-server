import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";

const createOrUpdateCommentImages = imageUpload.single("commentImage");

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    let commentImagePath;

    if (req?.body?.commentImage?.length)
      commentImagePath = req?.body?.commentImage[0];

    if (commentImagePath) req.body.commentImage = commentImagePath;

    next();
  },
);

export const CommentMiddleware = {
  createOrUpdateCommentImages,
  matchReqBodyFilesWithValidationSchema,
};
