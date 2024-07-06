import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { validateRequest } from "../../middleware/validate.request";
import { PostValidation } from "./post.validation";
import verifyMyChannel from "../../middleware/verify.my.channel";
import { PostController } from "./post.controller";
import verifyMyPost from "../../middleware/verify.my.post";

const router = express.Router();

// create post
router.post(
  "/:id", // :id ===> channelId
  validateRequest(PostValidation.createPostValidationSchema),
  getLoggedInUser,
  verifyMyChannel,
  PostController.createPost,
);

// update post
router.patch(
  "/:postId", // :postId ===> postId
  validateRequest(PostValidation.updatePostValidationSchema),
  getLoggedInUser,
  verifyMyPost, // checking is that my post or not
  PostController.updatePost,
);

router.delete(
  "/:postId", // :postId ===> postId
  validateRequest(PostValidation.updatePostValidationSchema),
  getLoggedInUser,
  verifyMyPost, // checking is that my post or not
  PostController.deletePost,
);

export const PostRoutes = router;
