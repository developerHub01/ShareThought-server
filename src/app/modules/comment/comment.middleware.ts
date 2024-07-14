import { imageUpload } from "../../utils/multer.image.upload";

const createOrUpdateCommentImages = imageUpload.single("commentImage");

export const CommentMiddleware = { createOrUpdateCommentImages };
