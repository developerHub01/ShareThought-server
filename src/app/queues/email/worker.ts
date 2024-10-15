import { Worker } from "bullmq";
import { redisOptions } from "../../config/redis.config";
import { QueueJobList } from "..";
import { AuthEmailServices } from "./services/auth";
import { ModeratorEmailServices } from "./services/moderator";

export const emailWorker = new Worker(
  "emailQueue",
  async ({ name, data }) => {
    switch (name) {
      case QueueJobList.SEND_VERIFICATION_EMAIL:
        return await AuthEmailServices.sendVerificationEmail(data);
      case QueueJobList.SEND_RESET_PASSWORD_EMAIL:
        return await AuthEmailServices.sendForgetPasswordEmail(data);
      case QueueJobList.SEND_LOGGED_IN_USER_INFO:
        return await AuthEmailServices.sendLoggedInUserInfoEmail(data);
      case QueueJobList.SEND_MODERATOR_REQUEST_EMAIL:
        return await ModeratorEmailServices.sendModeratorRequestEmail(data);
      case QueueJobList.SEND_MODERATOR_REQUEST_ACCEPTANCE_EMAIL:
        return await ModeratorEmailServices.sendModeratorRequestAccptanceEmail(
          data,
        );
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
