import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { validateRequest } from "../../middleware/validate.request";
import { PostValidation } from "./post.validation";
import verifyMyChannel from "../../middleware/verify.my.channel";
import { PostController } from "./post.controller";
import verifyMyPost from "../../middleware/verify.my.post";
import { PostMiddleware } from "./post.middleware";
import getActiveChannel from "../../middleware/get.active.channel";
import checkChannelStatus from "../../middleware/check.channel.status";
import readReqBodyFiles from "../../middleware/read.req.body.files";
import rateLimit from "../../middleware/rate.limit";
import isVerified from "../../middleware/is.Verified";

const router = express.Router();

router.get("/all", PostController.findPost);

// get post by Id
router.get(
  "/:postId",
  rateLimit({
    limit: 10,
    timer: 60,
    prefix: `post`,
  }),
  checkChannelStatus,
  PostController.findPostByPostId,
);

// get post by channelId
router.get(
  "/channel/:id" /* :id ====> channelId */,
  checkChannelStatus,
  PostController.findPostByChannelId,
);

// create post
router.post(
  "/",
  PostMiddleware.createOrUpdatePostImages,
  readReqBodyFiles /* read files info from formData */,
  PostMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(PostValidation.createPostValidationSchema),
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyChannel,
  PostMiddleware.isValidTags,
  PostController.createPost,
);

// update post
router.patch(
  "/:postId" /* :postId ===> postId */,
  PostMiddleware.createOrUpdatePostImages,
  readReqBodyFiles /* read files info from formData */,
  PostMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(PostValidation.updatePostValidationSchema),
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyChannel,
  verifyMyPost /* checking is that my post or not */,
  PostMiddleware.isValidTags,
  PostController.updatePost,
);

router.delete(
  "/:postId" /* :postId ===> postId */,
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyChannel,
  verifyMyPost /*checking is that my post or not */,
  PostController.deletePost,
);

export const PostRoutes = router;
