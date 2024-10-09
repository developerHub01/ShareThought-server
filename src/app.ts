import path from "path";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import IndexRoute from "./app/routes";
import { notFound } from "./app/middleware/notfound";
import { globalErrorHandler } from "./app/middleware/global.error.handler";
import "./app/config/cloudinary.config";
import createGuestUserIfNeed from "./app/middleware/create.guest.user";
import Redis from "ioredis";
import config from "./app/config";

export const redisOptions = {
  port: Number(config.REDIS_PORT),
  host: config.REDIS_HOST,
  // username: config.REDIS_USER_NAME,
  password: config.REDIS_PASSWORD,
  db: Number(config.REDIS_DB),
};

export const redis = new Redis(redisOptions);

import "./app/queues/email/worker";

const app: Application = express();

/*
 *
 * middlewares
 *
 */
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: ["http://localhost:5173"],
  }),
);

app.set("view enginee", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  "/cover_placeholder",
  express.static(path.join(__dirname, "public/cover_placeholder")),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
 *
 * custom middlewares
 *
 */
app.use(createGuestUserIfNeed);
// application routes
app.use("/api/v1", IndexRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("*", notFound);

app.use(globalErrorHandler);

export default app;
