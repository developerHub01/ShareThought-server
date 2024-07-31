import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";

const { PORT, DB_CONNECTION_STRING } = config;

(async () => {
  try {
    // eslint-disable-next-line no-console
    console.log({ DB_CONNECTION_STRING });

    await mongoose.connect(DB_CONNECTION_STRING as string);
    // eslint-disable-next-line no-console
    app.listen(PORT, () => console.log(`server is running at port ${PORT}`));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
