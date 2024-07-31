import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { PostConstant } from "./post.constant";

const createOrUpdatePostImage = async (
  imagePath: string,
  cloudinaryMediaPath: string,
  isUpdating: boolean = false,
  previousImage?: string,
) => {
  try {
    if (isUpdating && previousImage)
      await CloudinaryUtils.deleteFile([previousImage]);

    return await CloudinaryUtils.uploadFile(imagePath, cloudinaryMediaPath, {
      width: PostConstant.POST_BANNER_SIZE.WIDTH,
      height: PostConstant.POST_BANNER_SIZE.HEIGHT,
    });
  } catch (error) {
    return errorHandler(error);
  }
};

export const PostUtils = { createOrUpdatePostImage };
