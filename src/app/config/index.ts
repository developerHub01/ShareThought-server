import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const DB_PASSWORD = process.env.DB_PASSWORD;
export default {
  PORT: process.env.PORT,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING?.replace(
    "<password>",
    DB_PASSWORD as string,
  ),
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
};
