import express from "express";
import { CommunityPostController } from "./community.post.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import verifyMyCommunityPost from "../../middleware/verify.my.community.post";

const router = express.Router();

router.get("/", CommunityPostController.findCommuityPosts);

router.get("/channel/:id", CommunityPostController.findCommuityPostsByChannelId);

router.get(
  "/my",
  getLoggedInUser,
  getActiveChannel,
  CommunityPostController.findCommuityPostsByChannelId,
);

router.get("/:id", CommunityPostController.findCommuityPostById);

router.post(
  "/",
  getLoggedInUser,
  getActiveChannel,
  CommunityPostController.createPost,
);

router.patch(
  "/:id",
  getLoggedInUser,
  getActiveChannel,
  verifyMyCommunityPost,
  CommunityPostController.updatePost,
);

router.delete(
  "/:id",
  getLoggedInUser,
  getActiveChannel,
  verifyMyCommunityPost,
  CommunityPostController.deletePost,
);

export const CommunityPostRoutes = router;
