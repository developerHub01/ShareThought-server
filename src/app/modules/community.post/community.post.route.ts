import express from "express";
import { CommunityPostController } from "./community.post.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import verifyMyCommunityPost from "../../middleware/verify.my.community.post";
import { CommunityPostMiddleware } from "./community.post.middleware";
import { CommunityPostValidation } from "./community.post.validation";
import { validateRequest } from "../../middleware/validate.request";
import readReqBodyFiles from "../../middleware/read.req.body.files";

const router = express.Router();

router.get("/", CommunityPostController.findCommuityPosts);

router.get(
  "/channel/:id",
  CommunityPostController.findCommuityPostsByChannelId,
);

router.get(
  "/my",
  getLoggedInUser,
  getActiveChannel,
  CommunityPostController.findCommuityPostsMine,
);

router.get("/:id", CommunityPostController.findCommuityPostById);

router.post(
  "/",
  CommunityPostMiddleware.createOrUpdatePostImages,
  readReqBodyFiles /* read files info from formData */,
  CommunityPostMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommunityPostValidation.createPostValidationSchema),
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
