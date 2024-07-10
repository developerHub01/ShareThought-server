import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middleware/validate.request";
import { CategoryValidation } from "./category.validation";
const router = express.Router();

router.get("/:id" /* id ==> categoryId */);

router.get("/:id/channel" /* id ==> channelId */);

router.post(
  "/",
  validateRequest(CategoryValidation.createCategory),
  getLoggedInUser,
  CategoryController.createCategory,
);

router.post(
  "/",
  validateRequest(CategoryValidation.createCategory),
  getLoggedInUser,
  CategoryController.createCategory,
);

export const CategoryRoutes = router;
