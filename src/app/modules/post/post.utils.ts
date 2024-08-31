import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { PostConstant } from "./post.constant";

const createOrUpdatePostImage = async (
  imagePath: string,
  cloudinaryMediaPath: string,
  isUpdating: boolean = false,
  previousImage?: string,
) => {
  if (isUpdating && previousImage)
    await CloudinaryUtils.deleteFile([previousImage]);

  return await CloudinaryUtils.uploadFile(imagePath, cloudinaryMediaPath, {
    width: PostConstant.POST_BANNER_SIZE.WIDTH,
    height: PostConstant.POST_BANNER_SIZE.HEIGHT,
  });
};

export const PostUtils = { createOrUpdatePostImage };
