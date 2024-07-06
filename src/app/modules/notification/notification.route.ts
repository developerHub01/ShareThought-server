import express from "express";
import { NotificationController } from "./notification.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";

const router = express.Router();

router.get("/user", getLoggedInUser, NotificationController.findMyNotification);

router.get(
  "/channel/:id" /* id ===> channelId */,
  getLoggedInUser,
  NotificationController.findChannelNotification,
);

export const NotificationRoutes = router;
