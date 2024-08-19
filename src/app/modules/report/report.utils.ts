import errorHandler from "../../errors/errorHandler";
import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const createReportImage = async (
  imagePaths: Array<string>,
  cloudinaryMediaPath: string,
  isUpdating: boolean = false,
  previousImage?: string,
) => {
  try {
    if (isUpdating && previousImage)
      await CloudinaryUtils.deleteFile([previousImage]);

    for (const imagePathIndex in imagePaths) {
      imagePaths[imagePathIndex] = (await CloudinaryUtils.uploadFile(
        imagePaths[imagePathIndex],
        cloudinaryMediaPath,
      )) as string;
    }

    return imagePaths;
  } catch (error) {
    return errorHandler(error);
  }
};

export const ReportUtils = {
  createReportImage,
};
