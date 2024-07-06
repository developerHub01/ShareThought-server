import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CommentController } from "./comment.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CommentValidation } from "./comment.validation";
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
  "/",
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  CommentController.createComment,
);

router.put(
  "/",
  validateRequest(CommentValidation.createOrUpdateComment),
  getLoggedInUser,
  CommentController.updateComment,
);

router.delete(
  "/:id" /* :id ===> commentId */,
  getLoggedInUser,
  CommentController.deleteComment,
);

export const CommentRoutes = router;
