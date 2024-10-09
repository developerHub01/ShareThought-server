import { Queue } from "bullmq";
import { redisOptions } from "../../../app";

export const emailQueue = new Queue("emailQueue", {
  connection: redisOptions,
});
