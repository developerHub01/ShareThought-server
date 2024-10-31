import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const uploadCommentImage = async ({
  imagePath,
  cloudinaryMediaPath,
  isUpdating = false,
  previousImage,
}: {
  imagePath: string;
  cloudinaryMediaPath: string;
  isUpdating?: boolean;
  previousImage?: string;
}) => {
  if (isUpdating && previousImage)
    await CloudinaryUtils.deleteFile([previousImage]);

  return await CloudinaryUtils.uploadFile(imagePath, cloudinaryMediaPath);
};

export const CommentUtils = { uploadCommentImage };
