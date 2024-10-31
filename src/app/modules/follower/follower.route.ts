import getLoggedInUser from "../../middleware/get.loggedin.user";
import { FollowerController } from "./follower.controller";
import express from "express";
import channelExist from "../../middleware/channel.exist";
import verifyMyChannel from "../../middleware/verify.my.channel";
import getActiveChannel from "../../middleware/get.active.channel";
import isValidChannel from "../../middleware/is.valid.channel";
import isVerified from "../../middleware/is.verified";
import checkChannelStatus from "../../middleware/check.channel.status";
const router = express.Router();

// channel following by me
router.get(
  "/following",
  getLoggedInUser,
  isVerified,
  FollowerController.getChannelFollowing,
);

router.get(
  "/:channelId/followers_count",
  isValidChannel,
  FollowerController.getChannelFollowersCount,
);

// channel follow or unfollow
router.get(
  "/:channelId/follow_toggle",
  getLoggedInUser,
  isVerified,
  checkChannelStatus,
  isValidChannel,
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
