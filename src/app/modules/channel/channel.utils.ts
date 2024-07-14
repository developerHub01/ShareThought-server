import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const updateChannelImage = async (
  imagePath: string,
  previousImage: string,
  cloudinaryMediaPath: string,
) => {
  try {
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

export const ChannelUtils = { updateChannelImage };
