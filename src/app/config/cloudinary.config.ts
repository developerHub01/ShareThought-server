import { v2 as cloudinary } from "cloudinary";
import config from "../config";

interface ICloudinaryConfigOptions {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

type config = (param: ICloudinaryConfigOptions) => unknown;

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});
