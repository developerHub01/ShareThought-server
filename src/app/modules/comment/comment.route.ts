import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CommentController } from "./comment.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CommentValidation } from "./comment.validation";
import verifyMyPost from "../../middleware/verify.my.post";
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
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  CommentController.createComment,
);

router.post(
  "/reply/:id" /* :id ===> commentId */,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  CommentController.replyComment,
);

router.patch(
  "/:id" /* :id ===> commentId */,
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  CommentController.updateComment,
);

router.delete(
  "/:id" /* :id ===> commentId */,
  getLoggedInUser,
  CommentController.deleteComment,
);

router.delete(
  "/post/:id" /* :id ===> postId */,
  getLoggedInUser,
  verifyMyPost,
  CommentController.findCommentByPostId,
);

export const CommentRoutes = router;
