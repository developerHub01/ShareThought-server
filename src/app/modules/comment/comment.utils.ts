import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const uploadCommentImage = async (
  imagePath: string,
  cloudinaryMediaPath: string,
  isUpdating: boolean = false,
  previousImage?: string,
) => {
  if (isUpdating && previousImage)
    await CloudinaryUtils.deleteFile([previousImage]);

  return await CloudinaryUtils.uploadFile(imagePath, cloudinaryMediaPath);
};

export const CommentUtils = { uploadCommentImage };
