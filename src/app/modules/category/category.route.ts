import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CategoryValidation } from "./category.validation";
import haveAccessCategory from "../../middleware/have.access.category";
import verifyMyPost from "../../middleware/verify.my.post";
const router = express.Router();

router.get("/:id" /* id ==> categoryId */, CategoryController.findCategoryById);

router.get(
  "/channel/:id" /* id ==> channelId */,
  CategoryController.findCategoryByChannelId,
);

router.post(
  "/:id/post/:postId",
  /* 
  id ==> categoryId 
  */
  getLoggedInUser,
  haveAccessCategory,
  verifyMyPost,
  CategoryController.addPostInCategory,
);

router.post(
  "/",
  validateRequest(CategoryValidation.createCategory),
  getLoggedInUser,
  CategoryController.createCategory,
);

router.patch(
  "/:id" /* id ==> categoryId */,
  validateRequest(CategoryValidation.updateCategory),
  getLoggedInUser,
  haveAccessCategory,
  CategoryController.updateCategory,
);

router.delete(
  ":id/post/:postId",
  /* 
    id ==> categoryId 
  */
  validateRequest(CategoryValidation.updateCategory),
  getLoggedInUser,
  verifyMyPost,
  CategoryController.removePostFromCategory,
);

router.delete(
  "/:id" /* id ==> categoryId */,
  validateRequest(CategoryValidation.updateCategory),
  getLoggedInUser,
  haveAccessCategory,
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
