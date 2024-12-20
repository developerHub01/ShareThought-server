import { TGender } from "../../interface/interface";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { UserConstant } from "./user.constant";

type TGenerateAvatarURL = (params: {
  gender: TGender;
  userName: string;
}) => string;

const generateAvatarURL: TGenerateAvatarURL = ({ gender, userName }) => {
  const genderValue =
    gender === UserConstant.GENDER_TYPES.MALE ? "boy" : "girl";
  return `https://avatar.iran.liara.run/public/${genderValue}?username=${userName}`;
};

const updateUserAvatar = async ({
  imagePath,
  cloudinaryMediaPath,
  isUpdating = false,
  previousImage,
}: {
  imagePath: string;
  cloudinaryMediaPath: string;
  isUpdating: boolean;
  previousImage?: string;
}) => {
  if (isUpdating && previousImage)
    await CloudinaryUtils.deleteFile([previousImage]);

  return await CloudinaryUtils.uploadFile(imagePath, cloudinaryMediaPath, {
    width: UserConstant.USER_AVATAR_SIZE.WIDTH,
    height: UserConstant.USER_AVATAR_SIZE.HEIGHT,
  });
};

export const UserUtils = {
  generateAvatarURL,
  updateUserAvatar,
};
