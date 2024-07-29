import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CommentController } from "./comment.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CommentValidation } from "./comment.validation";
import verifyMyPost from "../../middleware/verify.my.post";
import { CommentMiddleware } from "./comment.middleware";
import verifyMyComment from "../../middleware/verify.my.comment";
import checkChannelStatus from "../../middleware/check.channel.status";
import haveAccessDeleteComment from "../../middleware/have.access.delete.comment";
import verifyMyCommunityPost from "../../middleware/verify.my.community.post";
import getActiveChannel from "../../middleware/get.active.channel";
import readReqBodyFiles from "../../middleware/read.req.body.files";

const router = express.Router();

/**
 *
 *  get blog post all comments
 *
 * ***/
router.get(
  "/post/:postId",
  getLoggedInUser,
  CommentController.findCommentByPostId,
);

/**
 *
 *  get community post all comments
 *
 * ***/
router.get(
  "/community/:communityPostId",
  getLoggedInUser,
  CommentController.findCommentByPostId,
);

router.get(
  "/:id" /* :id ===> commmentId */,
  getLoggedInUser,
  CommentController.findCommentById,
);

/**
 *
 *  post comments in blog post
 *
 * ***/
router.post(
  "/:postId",
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  checkChannelStatus,
  CommentController.createComment,
);

/**
 *
 *  post comments in community post
 *
 * ***/
router.post(
  "/community/:communityPostId",
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  checkChannelStatus,
  CommentController.createComment,
);

/* reply comment */
router.post(
  "/reply/:id" /* :id ===> commentId */,
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  checkChannelStatus,
  CommentController.replyComment,
);

router.patch(
  "/:id" /* :id ===> commentId */,
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  checkChannelStatus,
  verifyMyComment,
  CommentController.updateComment,
);

router.delete(
  "/:id" /* :id ===> commentId */,
  getLoggedInUser,
  checkChannelStatus,
  haveAccessDeleteComment,
  CommentController.deleteComment,
);

/**
 *
 *  delete blog post all comments
 *
 * ***/
router.delete(
  "/post/:postId",
  getLoggedInUser,
  getActiveChannel,
  verifyMyPost,
  CommentController.deleteAllComment,
);

/**
 *
 *  delete community post all comments
 *
 * ***/
router.delete(
  "/community/:communityPostId" /* :id ===> postId */,
  getLoggedInUser,
  getActiveChannel,
  verifyMyCommunityPost,
  CommentController.deleteAllComment,
);

export const CommentRoutes = router;
