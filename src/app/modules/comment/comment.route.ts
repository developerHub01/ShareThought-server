import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CommentController } from "./comment.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CommentValidation } from "./comment.validation";
import { CommentMiddleware } from "./comment.middleware";
import checkChannelStatus from "../../middleware/check.channel.status";
import haveAccessDeleteComment from "../../middleware/have.access.delete.comment";
import verifyMyPost from "../../middleware/verify.my.post";
import getActiveChannel from "../../middleware/get.active.channel";
import readReqBodyFiles from "../../middleware/read.req.body.files";
import isVerified from "../../middleware/is.Verified";
import checkChannelUserRole from "../../middleware/check.channel.user.role";
import checkModeratorStatus from "../../middleware/check.moderator.status";
import isMyPost from "../../middleware/is.my.post";

const router = express.Router();

/**
 *  get blog post all comments
 * ***/
router.get(
  "/post/:postId",
  getLoggedInUser,
  checkChannelStatus,
  checkModeratorStatus,
  checkChannelUserRole,
  isMyPost,
  CommentController.findCommentByPostId,
);

/**
 *  get community post all comments
 * ***/
router.get(
  "/community/:communityPostId",
  getLoggedInUser,
  checkChannelStatus,
  checkModeratorStatus,
  checkChannelUserRole,
  isMyPost,
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
  CommentMiddleware.havePermissionToComment("pin"), // for pin/unpin anyone can be pass as argument
  CommentController.togglePinComment,
);

/**
 *  toggle visibility a comment
 * ***/
router.get(
  "/toggle_visibility/:id",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  CommentMiddleware.havePermissionToComment("hide"), // for hide/show anyone can be pass as argument
  CommentController.toggleVisibility,
);

router.get(
  "/:id" /* :id ===> commmentId */,
  getLoggedInUser,
  checkChannelStatus,
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
  checkModeratorStatus,
  checkChannelUserRole,
  CommentMiddleware.havePermissionToComment("create"),
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
  checkModeratorStatus,
  checkChannelUserRole,
  CommentMiddleware.havePermissionToComment("create"),
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
  checkModeratorStatus,
  checkChannelUserRole,
  CommentMiddleware.havePermissionToComment("create"),
  CommentController.replyComment,
);

/***
 * update comment
 * **/
router.patch(
  "/:id" /* :id ===> commentId */,
  CommentMiddleware.createOrUpdateCommentImages,
  readReqBodyFiles /* read files info from formData */,
  CommentMiddleware.matchReqBodyFilesWithValidationSchema,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  isVerified,
  checkChannelStatus,
  checkModeratorStatus,
  checkChannelUserRole,
  CommentMiddleware.havePermissionToComment("update"),
  CommentController.updateComment,
);

router.delete(
  "/:id" /* :id ===> commentId */,
  getLoggedInUser,
  isVerified,
  checkChannelStatus,
  haveAccessDeleteComment,
  checkModeratorStatus,
  checkChannelUserRole,
  CommentMiddleware.havePermissionToComment("delete"),
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
  verifyMyPost,
  CommentController.deleteAllComment,
);

export const CommentRoutes = router;
