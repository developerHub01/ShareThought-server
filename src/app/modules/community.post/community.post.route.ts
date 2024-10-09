import express from "express";
import { CommunityPostController } from "./community.post.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import verifyMyCommunityPost from "../../middleware/verify.my.community.post";
import { CommunityPostMiddleware } from "./community.post.middleware";
import { CommunityPostValidation } from "./community.post.validation";
import { validateRequest } from "../../middleware/validate.request";
import readReqBodyFiles from "../../middleware/read.req.body.files";
import checkChannelStatus from "../../middleware/check.channel.status";

const router = express.Router();

router.get("/", CommunityPostController.findCommuityPosts);

router.get(
  "/channel/:id",
  CommunityPostController.findCommuityPostsByChannelId,
);

/* find my selected option in a post options */
router.get(
  "/my_selection/:id",
  getLoggedInUser,
  checkChannelStatus,
  CommunityPostController.findMySelectionPostOption,
);

router.get(
  "/my",
  getLoggedInUser,
  getActiveChannel,
  CommunityPostController.findCommuityPostsMine,
);

router.get(
  "/:id",
  checkChannelStatus,
  CommunityPostController.findCommuityPostById,
);

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

router.patch(
  "/:id/select_unselect/:optionIndex",
  getLoggedInUser,
  checkChannelStatus,
  CommunityPostController.selectPollOrQuizOption,
);

router.delete(
  "/:id",
  getLoggedInUser,
  getActiveChannel,
  verifyMyCommunityPost,
  CommunityPostController.deletePost,
);

export const CommunityPostRoutes = router;
