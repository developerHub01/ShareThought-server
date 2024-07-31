import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const uploadCommentImage = async (
  imagePath: string,
  cloudinaryMediaPath: string,
  isUpdating: boolean = false,
  previousImage?: string,
) => {
  try {
    if (isUpdating && previousImage)
      await CloudinaryUtils.deleteFile([previousImage]);

    return await CloudinaryUtils.uploadFile(imagePath, cloudinaryMediaPath);
  } catch (error) {
    return errorHandler(error);
  }
};

export const CommentUtils = { uploadCommentImage };
