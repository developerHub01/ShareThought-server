import Redis from "ioredis";
import config from "./index";

export const redisOptions = {
  port: Number(config.REDIS_PORT),
  host: config.REDIS_HOST,
  // username: config.REDIS_USER_NAME,
  password: config.REDIS_PASSWORD,
  db: Number(config.REDIS_DB),
};

export const redis = new Redis(redisOptions);
