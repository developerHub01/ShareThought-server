import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const DB_PASSWORD = process.env.DB_PASSWORD;
export default {
  PORT: process.env.PORT as string,
  PROJECT_ENVIRONMENT: (
    process.env.PROJECT_ENVIRONMENT as string
  ).toLowerCase(),
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING?.replace(
    "<password>",
    DB_PASSWORD as string,
  ) as string,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
  BASE_URL: process.env.BASE_URL as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,

  REDIS_PORT: process.env.REDIS_PORT as string,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_USER_NAME: process.env.REDIS_USER_NAME as string,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  REDIS_DB: process.env.REDIS_DB as string,
};
