import { CloudinaryUtils } from "../../utils/cloudinary.utils";

const createReportImage = async ({
  imagePaths,
  cloudinaryMediaPath,
  isUpdating = false,
  previousImage,
}: {
  imagePaths: Array<string>;
  cloudinaryMediaPath: string;
  isUpdating?: boolean;
  previousImage?: string;
}) => {
  if (isUpdating && previousImage)
    await CloudinaryUtils.deleteFile([previousImage]);

  for (const imagePathIndex in imagePaths) {
    imagePaths[imagePathIndex] = (await CloudinaryUtils.uploadFile(
      imagePaths[imagePathIndex],
      cloudinaryMediaPath,
    )) as string;
  }

  return imagePaths;
};

export const ReportUtils = {
  createReportImage,
};
