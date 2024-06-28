import express, { Application, Request, Response } from "express";
import cors from "cors";
import IndexRoute from "./app/routes";
import { notFound } from "./app/middleware/notfound";
import { globalErrorHandler } from "./app/middleware/global.error.handler";

const app: Application = express();

app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", IndexRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("*", notFound);

app.use(globalErrorHandler);

export default app;
