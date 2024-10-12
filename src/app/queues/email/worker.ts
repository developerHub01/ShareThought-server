import { Worker } from "bullmq";
import { AuthUtils } from "../../modules/auth/auth.utils";
import { redisOptions } from "../../config/redis.config";
import { QueueJobList } from "..";

export const emailWorker = new Worker(
  "emailQueue",
  async ({ name, data }) => {
    switch (name) {
      case QueueJobList.SEND_VERIFICATION_EMAIL:
        return await AuthUtils.sendVerificationEmail(data);
      case QueueJobList.SEND_RESET_PASSWORD_EMAIL:
        return await AuthUtils.sendForgetPasswordEmail(data);
      case QueueJobList.SEND_LOGGED_IN_USER_INFO:
        return await AuthUtils.sendLoggedInUserInfoEmail(data);
    }
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
