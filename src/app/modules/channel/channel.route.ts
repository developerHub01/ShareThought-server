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
import isVerified from "../../middleware/is.Verified";

const router = express.Router();

router.get("/all", getLoggedInUser, isVerified, ChannelController.findChannel);

router.get("/my", getLoggedInUser, isVerified, ChannelController.getMyChannel);

router.get(
  "/my_moderated",
  getLoggedInUser,
  isVerified,
  ChannelController.getMyModeratedChannel,
);

router.get(
  "/moderator_count",
  getLoggedInUser,
  getActiveChannel,
  verifyMyChannel,
  ChannelController.channelModeratorCount,
);

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
  isVerified,
  ChannelController.createChannel,
);

/* activate a specific channel */
router.patch(
  "/switch/:id" /* id ===> channelId */,
  getLoggedInUser,
  isVerified,
  ChannelController.switchChannel,
);

router.patch(
  "/",
  ChannelMiddleware.updateChannelImages,
  readReqBodyFiles /* read files info from formData */,
  ChannelMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(ChannelValidation.updateChannelValidationSchema),
  isVerified,
  getLoggedInUser,
  getActiveChannel,
  verifyMyChannel,
  ChannelController.updateChannel,
);

/* logout from a chnnale or back to main profile */
router.delete(
  "/logout",
  getLoggedInUser,
  isVerified,
  ChannelController.logOutChannel,
);

router.delete(
  "/",
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  channelExist,
  verifyMyChannel,
  ChannelController.deleteChannel,
);

export const ChannelRoutes = router;
