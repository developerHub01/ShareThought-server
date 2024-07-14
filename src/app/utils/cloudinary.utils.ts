import cloudinary from "cloudinary";
import errorHandler from "../errors/errorHandler";
import { CloudinaryConstant } from "../constants/cloudinary.constant";

const getFileIdList = (filePaths: Array<string>) =>
  filePaths.map((file) => {
    const tempFile = file;
    const urlPrefix = tempFile.split(
      CloudinaryConstant.SHARE_THOUGHT_ROOT_FOLDER_NAME,
    )[0];

    const fileName = file.split(urlPrefix).pop()?.split(".");
    fileName?.pop();

    if (!fileName) return "";

    return fileName.join(".");
  });

const uploadFile = async (filePath: string, cloudinaryMediaPath: string) => {
  try {
    const { url, secure_url } = await cloudinary.v2.uploader.upload(filePath, {
      folder: `/${CloudinaryConstant.SHARE_THOUGHT_ROOT_FOLDER_NAME}/${cloudinaryMediaPath}`,
      resource_type: "image",
    });

    return {
      url,
      secure_url,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const deleteFile = async (filePaths: Array<string>) => {
  try {
    filePaths = getFileIdList(filePaths);

    const result = await cloudinary.v2.api.delete_resources(filePaths, {
      type: "upload",
      resource_type: "image",
    });

    return result;
  } catch (error) {
    errorHandler(error);
  }
};

export const CloudinaryUtils = { getFileIdList, uploadFile, deleteFile };
