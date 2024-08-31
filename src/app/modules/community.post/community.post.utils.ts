import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { CommunityPostConstant } from "./community.post.constant";
import {
  ICommunityPostPollOption,
  ICommunityPostQuizOption,
  TCommunityPostType,
} from "./community.post.interface";

const createOrUpdatePostImage = async (
  imagePath: string,
  postType: TCommunityPostType,
  cloudinaryMediaPath: string,
  isUpdating: boolean,
  previousImage?: string,
) => {
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
};

const isQuizOption = (
  option: ICommunityPostQuizOption | ICommunityPostPollOption,
): option is ICommunityPostQuizOption => "answeredUsers" in option;

const isPollOption = (
  option: ICommunityPostQuizOption | ICommunityPostPollOption,
): option is ICommunityPostPollOption => "polledUsers" in option;

const calculateSuccessRate = (selectCount: number, total: number): number =>
  Math.floor((selectCount * 100) / (total || 1));

export const CommunityPostUtils = {
  createOrUpdatePostImage,
  isPollOption,
  isQuizOption,
  calculateSuccessRate,
};
