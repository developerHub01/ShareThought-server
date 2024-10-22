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
import isVerified from "../../middleware/is.Verified";
import checkChannelUserRole from "../../middleware/check.channel.user.role";
import checkModeratorStatus from "../../middleware/check.moderator.status";

const router = express.Router();

/**
 *  get blog post all comments
 * ***/
router.get(
  "/post/:postId",
  getLoggedInUser,
  CommentController.findCommentByPostId,
);

/**
 *  get community post all comments
 * ***/
router.get(
  "/community/:communityPostId",
  getLoggedInUser,
  CommentController.findCommentByPostId,
);

/**
 *  toggle pin a comment
 * ***/
router.get(
  "/toggle_pin/:id",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  CommentController.togglePinComment,
);

/**
 *  toggle visibility a comment
 * ***/
router.get(
  "/toggle_visibility/:id",
  getLoggedInUser,
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  CommentController.toggleVisibility,
);

router.get(
  "/:id" /* :id ===> commmentId */,
  getLoggedInUser,
  CommentController.findCommentById,
);

/**
 *  post comments in blog post
 * ***/
router.post(
  "/:postId",
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  isVerified,
  checkChannelStatus,
  CommentController.createComment,
);

/**
 *  post comments in community post
 * ***/
router.post(
  "/community/:communityPostId",
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  isVerified,
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
  isVerified,
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
  isVerified,
  checkChannelStatus,
  verifyMyComment,
  CommentController.updateComment,
);

router.delete(
  "/:id" /* :id ===> commentId */,
  getLoggedInUser,
  isVerified,
  checkChannelStatus,
  haveAccessDeleteComment,
  CommentController.deleteComment,
);

/**
 *  delete blog post all comments
 * ***/
router.delete(
  "/post/:postId",
  getLoggedInUser,
  getActiveChannel,
  verifyMyPost,
  isVerified,
  CommentController.deleteAllComment,
);

/**
 *  delete community post all comments
 * ***/
router.delete(
  "/community/:communityPostId" /* :id ===> postId */,
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyCommunityPost,
  CommentController.deleteAllComment,
);

export const CommentRoutes = router;
