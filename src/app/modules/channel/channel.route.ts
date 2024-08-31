import express from "express";
import { ChannelController } from "./channel.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { ChannelValidation } from "./channel.validation";
import { validateRequest } from "../../middleware/validate.request";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";
import { ChannelMiddleware } from "./channel.middleware";
import getActiveChannel from "../../middleware/get.active.channel";
import readReqBodyFiles from "../../middleware/read.req.body.files";
import checkChannelStatus from "../../middleware/check.channel.status";

const router = express.Router();

router.get("/all", getLoggedInUser, ChannelController.findChannel);

router.get("/my", getLoggedInUser, ChannelController.getMyChannel);

router.get(
  "/:id",
  getLoggedInUser,
  checkChannelStatus,
  ChannelController.singleChannel,
);

router.post(
  "/",
  validateRequest(ChannelValidation.createChannelValidationSchema),
  getLoggedInUser,
  ChannelController.createChannel,
);

/* activate a specific channel */
router.patch(
  "/switch/:id" /* id ===> channelId */,
  getLoggedInUser,
  ChannelController.switchChannel,
);

router.patch(
  "/",
  ChannelMiddleware.updateChannelImages,
  readReqBodyFiles /* read files info from formData */,
  ChannelMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(ChannelValidation.updateChannelValidationSchema),
  getLoggedInUser,
  getActiveChannel,
  verifyMyChannel,
  ChannelController.updateChannel,
);

/* logout from a chnnale or back to main profile */
router.delete("/logout", getLoggedInUser, ChannelController.logOutChannel);

router.delete(
  "/",
  getLoggedInUser,
  getActiveChannel,
  channelExist,
  verifyMyChannel,
  ChannelController.deleteChannel,
);

export const ChannelRoutes = router;
