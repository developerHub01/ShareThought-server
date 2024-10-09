import getLoggedInUser from "../../middleware/get.loggedin.user";
import { FollowerController } from "./follower.controller";
import express from "express";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";
import getActiveChannel from "../../middleware/get.active.channel";
import isVerified from "../../middleware/is.verified";
const router = express.Router();

// channel following by me
router.get(
  "/following",
  getLoggedInUser,
  isVerified,
  FollowerController.getChannelFollowing,
);

// channel follow or unfollow
router.get(
  "/follow_toggle",
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  channelExist,
  FollowerController.handleChannelFollowToggle,
);

// chennel followers
router.get(
  "/",
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  channelExist,
  verifyMyChannel,
  FollowerController.getChannelFollowers,
);

export const FollowerRoutes = router;
