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
    DB_PASSWORD as string
  ),
};
