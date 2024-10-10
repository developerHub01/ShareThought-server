import { Queue } from "bullmq";
import { redisOptions } from "../../config/redis.config";

export const emailQueue = new Queue("emailQueue", {
  connection: redisOptions,
});
