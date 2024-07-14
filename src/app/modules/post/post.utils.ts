import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const createOrUpdatePostImage = async (
  imagePath: string,
  cloudinaryMediaPath: string,
  isUpdating: boolean = false,
  previousImage?: string,
) => {
  try {
    if (isUpdating && previousImage)
      await CloudinaryUtils.deleteFile([previousImage]);

    const coverImageDetails = await CloudinaryUtils.uploadFile(
      imagePath,
      cloudinaryMediaPath,
    );

    return coverImageDetails?.secure_url;
  } catch (error) {
    return errorHandler(error);
  }
};

export const PostUtils = { createOrUpdatePostImage };
