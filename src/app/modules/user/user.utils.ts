import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

type TGenerateAvatarURL = (
  gender: "male" | "female",
  userName: string,
) => string;

const generateAvatarURL: TGenerateAvatarURL = (gender, userName) => {
  const genderValue = gender === "male" ? "boy" : "girl";
  return `https://avatar.iran.liara.run/public/${genderValue}?username=${userName}`;
};

const updateUserAvatar = async (
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


export const UserUtils = {
  generateAvatarURL,
  updateUserAvatar,
};
