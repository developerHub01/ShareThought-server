import express from "express";
import { CommunityController } from "./community.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import verifyMyCommunityPost from "../../middleware/verify.my.community.post";

const router = express.Router();

router.get("/", CommunityController.findCommuityPosts);

router.get("/channel/:id", CommunityController.findCommuityPostsByChannelId);

router.get(
  "/my",
  getLoggedInUser,
  getActiveChannel,
  CommunityController.findCommuityPostsByChannelId,
);

router.get("/:id", CommunityController.findCommuityPostById);

router.post(
  "/",
  getLoggedInUser,
  getActiveChannel,
  CommunityController.createPost,
);

router.patch(
  "/:id",
  getLoggedInUser,
  getActiveChannel,
  verifyMyCommunityPost,
  CommunityController.updatePost,
);

router.delete(
  "/:id",
  getLoggedInUser,
  getActiveChannel,
  verifyMyCommunityPost,
  CommunityController.deletePost,
);

export const CommunityRoutes = router;
