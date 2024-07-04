import getLoggedInUser from "../../middleware/get.loggedin.user";
import { FollowerController } from "./follower.controller";
import express from "express";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";
const router = express.Router();

// channel following by me
router.get(
  "/following",
  getLoggedInUser,
  FollowerController.getChannelFollowing,
);

// channel follow or unfollow
router.get(
  "/follow_toggle/:id", //:id ===> channelId
  getLoggedInUser,
  channelExist,
  FollowerController.handleChannelFollowToggle,
);

// chennel followers
router.get(
  "/:id", //:id ===> channelId
  getLoggedInUser,
  channelExist,
  verifyMyChannel,
  FollowerController.getChannelFollowers,
);

export const FollowerRoutes = router;
