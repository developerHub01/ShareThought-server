import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";

const { PORT, DB_CONNECTION_STRING } = config;

let server: Server;

(async () => {
  try {
    // eslint-disable-next-line no-console
    console.log({ DB_CONNECTION_STRING });

    await mongoose.connect(DB_CONNECTION_STRING as string);
    // eslint-disable-next-line no-console
    server = app.listen(PORT, () =>
      // eslint-disable-next-line no-console
      console.log(`server is running at port ${PORT}`),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();

process.on("unhandledRejection", () => {
  // eslint-disable-next-line no-console
  console.log("unhandledRejection is detected.....");

  if (server) return server?.close(() => process.exit(1));

  process.exit(1);
});

process.on("uncaughtException", () => {
  // eslint-disable-next-line no-console
  console.log("uncaughtException is detected.....");  
  process.exit(1);
});
