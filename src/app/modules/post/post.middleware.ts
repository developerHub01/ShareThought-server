import { imageUpload } from "../../utils/multer.image.upload";

const createOrUpdatePostImages = imageUpload.fields([
  {
    name: "banner",
    maxCount: 1,
  },
]);

export const PostMiddleware = { createOrUpdatePostImages };
