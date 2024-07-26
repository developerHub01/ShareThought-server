import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CommentController } from "./comment.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CommentValidation } from "./comment.validation";
import verifyMyPost from "../../middleware/verify.my.post";
import { CommentMiddleware } from "./comment.middleware";
import verifyMyComment from "../../middleware/verify.my.comment";
import checkChannelStatus from "../../middleware/check.channel.status";
const router = express.Router();

router.get(
  "/post/:id" /* :id ===> postId */,
  getLoggedInUser,
  CommentController.findCommentByPostId,
);

router.get(
  "/:id" /* :id ===> commmentId */,
  getLoggedInUser,
  CommentController.findCommentById,
);

router.post(
  "/:id" /* :id ===> postId */,
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
  verifyMyComment,
  CommentController.deleteComment,
);

router.delete(
  "/comment_image/:id" /* :id ===> commentId */,
  getLoggedInUser,
  verifyMyComment,
  CommentController.deleteCommentImage,
);

router.delete(
  "/post/:id" /* :id ===> postId */,
  getLoggedInUser,
  verifyMyPost,
  CommentController.findCommentByPostId,
);

export const CommentRoutes = router;
