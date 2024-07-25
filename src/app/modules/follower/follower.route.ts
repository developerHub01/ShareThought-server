import getLoggedInUser from "../../middleware/get.loggedin.user";
import { FollowerController } from "./follower.controller";
import express from "express";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";
import getActiveChannel from "../../middleware/get.active.channel";
const router = express.Router();

// channel following by me
router.get(
  "/following",
  getLoggedInUser,
  FollowerController.getChannelFollowing,
);

// channel follow or unfollow
router.get(
  "/follow_toggle",
  getLoggedInUser,
  getActiveChannel,
  channelExist,
  FollowerController.handleChannelFollowToggle,
);

// chennel followers
router.get(
  "/",
  getLoggedInUser,
  getActiveChannel,
  channelExist,
  verifyMyChannel,
  FollowerController.getChannelFollowers,
);

export const FollowerRoutes = router;
