import express from "express";
import { ChannelController } from "./channel.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { ChannelValidation } from "./channel.validation";
import { validateRequest } from "../../middleware/validate.request";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";

const router = express.Router();

// const CHANNEL_AVATAR = "channelAvatar";
// const CHANNEL_COVER = "channelCover";

router.get("/all", getLoggedInUser, ChannelController.findChannel);

router.get("/", getLoggedInUser, ChannelController.getMyChannel);

router.post(
  "/",
  validateRequest(ChannelValidation.createChannelValidationSchema),
  getLoggedInUser,
  ChannelController.createChannel,
);

router.patch(
  "/:id",
  validateRequest(ChannelValidation.updateChannelValidationSchema),
  getLoggedInUser,
  verifyMyChannel,
  ChannelController.updateChannel,
);

router.delete(
  "/:id",
  getLoggedInUser,
  channelExist,
  verifyMyChannel,
  ChannelController.deleteChannel,
);

router.get("/:id", getLoggedInUser, ChannelController.getChannelById);

export const ChannelRoutes = router;
