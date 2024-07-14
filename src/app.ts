import path from "path";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import IndexRoute from "./app/routes";
import { notFound } from "./app/middleware/notfound";
import { globalErrorHandler } from "./app/middleware/global.error.handler";
import "./app/config/cloudinary.config";

const app: Application = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: ["http://localhost:5173"],
  }),
);

app.use(
  "/cover_placeholder",
  express.static(path.join(__dirname, "public/cover_placeholder")),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// application routes
app.use("/api/v1", IndexRoute);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("*", notFound);

app.use(globalErrorHandler);

export default app;
