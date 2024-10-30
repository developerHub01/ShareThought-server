import { Worker } from "bullmq";
import { redisOptions } from "../../config/redis.config";
import { QueueJobList } from "..";
import { AuthEmailServices } from "./services/auth";
import { ModeratorEmailServices } from "./services/moderator";
import { PostScheduleServices } from "./services/post";

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
      case QueueJobList.SEND_MODERATOR_RESIGNATION_EMAIL:
        return await ModeratorEmailServices.sendModeratorResignationEmail(data);
      case QueueJobList.SEND_MODERATOR_REMOVE_EMAIL:
        return await ModeratorEmailServices.sendModeratorRemoveEmail(data);
    }
  },
  {
    connection: redisOptions,
  },
);

export const postScheduleWorker = new Worker(
  "postScheduleQueue",
  async ({ name, data }) => {
    switch (name) {
      case QueueJobList.BLOG_POST_SCHEDULING_JOB:
        return await PostScheduleServices.scheduleBlogPost(data);
      case QueueJobList.COMMUNITY_POST_SCHEDULING_JOB:
        return await PostScheduleServices.scheduleCommunityPost(data);
    }
  },
  {
    connection: redisOptions,
  },
);

[emailWorker, postScheduleWorker].map(
  (worker: Worker<unknown, unknown, string>) => {
    worker.on("completed", (job) => {
      // eslint-disable-next-line no-console
      console.log(`Job ${job?.id} completed!`);
    });

    worker.on("failed", (job, err) => {
      // eslint-disable-next-line no-console
      console.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  },
);
