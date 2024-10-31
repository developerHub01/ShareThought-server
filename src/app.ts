import path from "path";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAgent from "express-useragent";
import IndexRoute from "./app/routes";
import { notFound } from "./app/middleware/not.found";
import { globalErrorHandler } from "./app/middleware/global.error.handler";
import "./app/config/cloudinary.config";
import createGuestUserIfNeed from "./app/middleware/create.guest.user";
import http from "http";
import initSocket from "./app/config/socket.config";

import "./app/config/redis.config";

import "./app/queues/email/worker";

const app: Application = express();
const server = http.createServer(app);
export const io = initSocket(server);

/*
 *
 * middlewares
 *
 */
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
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
app.use(userAgent.express());

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

app.get("/socket", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("*", notFound);

app.use(globalErrorHandler);

export default server;
