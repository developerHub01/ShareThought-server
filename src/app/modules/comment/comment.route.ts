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
  "/post/:communityPostId",
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
  "/:postId" /* :id ===> postId */,
  CommentMiddleware.createOrUpdateCommentImages,
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
  "/:communityPostId" /* :id ===> postId */,
  CommentMiddleware.createOrUpdateCommentImages,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  checkChannelStatus,
  CommentController.createComment,
);

/* reply comment */
router.post(
  "/reply/:id" /* :id ===> commentId */,
  CommentMiddleware.createOrUpdateCommentImages,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  checkChannelStatus,
  CommentController.replyComment,
);

router.patch(
  "/:id" /* :id ===> commentId */,
  CommentMiddleware.createOrUpdateCommentImages,
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
  "/post/:postId" /* :id ===> postId */,
  getLoggedInUser,
  verifyMyPost,
  CommentController.deleteAllComment,
);

/**
 * 
 *  delete community post all comments
 * 
 * ***/
router.delete(
  "/post/:communityPostId" /* :id ===> postId */,
  getLoggedInUser,
  verifyMyCommunityPost,
  CommentController.deleteAllComment,
);

export const CommentRoutes = router;
