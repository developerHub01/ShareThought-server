import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CategoryValidation } from "./category.validation";
import haveAccessCategory from "../../middleware/have.access.category";
import verifyMyPost from "../../middleware/verify.my.post";
import getActiveChannel from "../../middleware/get.active.channel";
import checkChannelStatus from "../../middleware/check.channel.status";
import verifyMyChannel from "../../middleware/verify.my.channel";
import verifyCategoryPostMine from "../../middleware/verify.category.post.mine";
import haveAccessCategoryModify from "../../middleware/have.access.category.modify";
import isPublicPost from "../../middleware/is.public.post";
import isVerified from "../../middleware/is.Verified";
const router = express.Router();

router.get(
  "/:id" /* id ==> categoryId */,
  checkChannelStatus,
  haveAccessCategory,
  CategoryController.findCategoryById,
);

router.get(
  "/channel/:id" /* id ==> channelId */,
  checkChannelStatus,
  CategoryController.findCategoryByChannelId,
);

/***
 *
 *  Add post in a specific category
 *
 * ***/
router.post(
  "/:id/post/:postId",
  /* 
  id ==> categoryId 
  */
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyChannel,
  haveAccessCategoryModify,
  verifyMyPost,
  isPublicPost,
  CategoryController.addPostInCategory,
);

router.post(
  "/",
  validateRequest(CategoryValidation.createCategory),
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyChannel,
  verifyCategoryPostMine,
  CategoryController.createCategory,
);

router.patch(
  "/:id" /* id ==> categoryId */,
  validateRequest(CategoryValidation.updateCategory),
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  haveAccessCategory,
  verifyCategoryPostMine,
  CategoryController.updateCategory,
);

/***
 *
 *  Remove a post from a specific category
 *
 * ***/
router.delete(
  "/:id/post/:postId",
  /* 
  id ==> categoryId 
  */
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  verifyMyChannel,
  haveAccessCategoryModify,
  CategoryController.removePostFromCategory,
);

router.delete(
  "/:id" /* id ==> categoryId */,
  getLoggedInUser,
  isVerified,
  getActiveChannel,
  haveAccessCategoryModify,
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
