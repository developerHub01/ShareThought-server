import { CloudinaryUtils } from "../../utils/cloudinary.utils";
import { IMediaFileDimension } from "../../interface/interface";

const updateChannelImage = async (
  imagePath: string,
  previousImage: string,
  cloudinaryMediaPath: string,
  dimension: IMediaFileDimension,
) => {
  await CloudinaryUtils.deleteFile([previousImage]);

  return await CloudinaryUtils.uploadFile(
    imagePath,
    cloudinaryMediaPath,
    dimension,
  );
};

export const ChannelUtils = { updateChannelImage };
