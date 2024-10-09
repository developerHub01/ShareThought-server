import { Worker } from "bullmq";
import { redisOptions } from "../../../app";
import { AuthUtils } from "../../modules/auth/auth.utils";

export const emailWorker = new Worker(
  "emailQueue",
  async ({ name, data }) => {
    if (name === "sendVerificationEmail")
      return await AuthUtils.sendVerificationEmail(data);
    if (name === "sendResetPasswordEmail")
      return await AuthUtils.sendForgetPasswordEmail(data);
  },
  {
    connection: redisOptions,
  },
);

emailWorker.on("completed", (job) => {
  // eslint-disable-next-line no-console
  console.log(`Job ${job?.id} completed!`);
});

emailWorker.on("failed", (job, err) => {
  // eslint-disable-next-line no-console
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
