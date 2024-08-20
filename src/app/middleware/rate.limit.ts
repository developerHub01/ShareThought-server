import httpStatus from "http-status";
import { redis } from "../../app";
import AppError from "../errors/AppError";
import { RedisKeys } from "../redis.keys";
import catchAsync from "../utils/catch.async";

const rateLimit = ({ limit = 10, timer = 60, prefix = "common" }) =>
  catchAsync(async (req, res, next) => {
    const clientIP = (req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress) as string;

    const countKey = RedisKeys.requestCountKey(clientIP, prefix);

    const requestCount = await redis.incr(countKey);

    if (requestCount === 1) await redis.expire(countKey, timer);

    if (requestCount >= limit) {
      const ttl = await redis.ttl(countKey);
      throw new AppError(
        httpStatus.TOO_MANY_REQUESTS,
        `Too many requests. Try after ${ttl}s`,
      );
    }

    return next();
  });

export default rateLimit;
