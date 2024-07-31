import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { IMediaFileDimension } from "../../interface/interface";

const updateChannelImage = async (
  imagePath: string,
  previousImage: string,
  cloudinaryMediaPath: string,
  dimension: IMediaFileDimension,
) => {
  try {
    await CloudinaryUtils.deleteFile([previousImage]);

    return await CloudinaryUtils.uploadFile(
      imagePath,
      cloudinaryMediaPath,
      dimension,
    );
  } catch (error) {
    return errorHandler(error);
  }
};

export const ChannelUtils = { updateChannelImage };
