import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";

const { PORT, DB_CONNECTION_STRING } = config;

(async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING as string);
    app.listen(PORT, () => console.log(`server is running at port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
})();
