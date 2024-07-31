import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { CommunityPostConstant } from "./community.post.constant";
import { TCommunityPostType } from "./community.post.interface";

const createOrUpdatePostImage = async (
  imagePath: string,
  postType: TCommunityPostType,
  cloudinaryMediaPath: string,
  isUpdating: boolean,
  previousImage?: string,
) => {
  try {
    if (isUpdating && previousImage)
      await CloudinaryUtils.deleteFile([previousImage]);

    if (
      !(
        postType === CommunityPostConstant.COMMUNITY_POST_TYPES.IMAGE ||
        postType === CommunityPostConstant.COMMUNITY_POST_TYPES.POLL_WITH_IMAGE
      )
    )
      return [];

    if (postType === CommunityPostConstant.COMMUNITY_POST_TYPES.IMAGE) {
      const dimension = {
        width: CommunityPostConstant.COMMUNITY_POST_IMAGE_DIMENSION.WIDTH,
        height: CommunityPostConstant.COMMUNITY_POST_IMAGE_DIMENSION.HEIGHT,
      };

      return await CloudinaryUtils.uploadFile(
        imagePath,
        cloudinaryMediaPath,
        dimension,
      );
    }
    const dimension = {
      width: CommunityPostConstant.COMMUNITY_POST_POLL_IMAGE_DIMENSION.WIDTH,
      height: CommunityPostConstant.COMMUNITY_POST_POLL_IMAGE_DIMENSION.HEIGHT,
    };

    return await CloudinaryUtils.uploadFile(
      imagePath,
      cloudinaryMediaPath,
      dimension,
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const CommunityPostUtils = {
  createOrUpdatePostImage,
};
