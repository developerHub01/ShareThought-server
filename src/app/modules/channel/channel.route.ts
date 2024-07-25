import express from "express";
import { ChannelController } from "./channel.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { ChannelValidation } from "./channel.validation";
import { validateRequest } from "../../middleware/validate.request";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";
import { ChannelMiddleware } from "./channel.middleware";

const router = express.Router();

router.get("/all", getLoggedInUser, ChannelController.findChannel);

router.get("/my", getLoggedInUser, ChannelController.getMyChannel);

router.get(
  "/:id" /* id ===> channelId */,
  getLoggedInUser,
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
  verifyMyChannel,
  ChannelController.switchChannel,
);

router.patch(
  "/:id" /* id ===> channelId */,
  ChannelMiddleware.updateChannelImages,
  validateRequest(ChannelValidation.updateChannelValidationSchema),
  getLoggedInUser,
  verifyMyChannel,
  ChannelController.updateChannel,
);

/* logout from a chnnale or back to main profile */
router.delete("/logout", getLoggedInUser, ChannelController.logOutChannel);

router.delete(
  "/:id" /* id ===> channelId */,
  getLoggedInUser,
  channelExist,
  verifyMyChannel,
  ChannelController.deleteChannel,
);

export const ChannelRoutes = router;
