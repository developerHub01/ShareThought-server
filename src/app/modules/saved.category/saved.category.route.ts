import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { SavedCategoryController } from "./saved.category.controller";
import isVerified from "../../middleware/is.Verified";

const router = express.Router();

router.get(
  "/",
  getLoggedInUser,
  isVerified,
  SavedCategoryController.findSavedCategory,
);

router.post(
  "/:categoryId",
  getLoggedInUser,
  isVerified,
  SavedCategoryController.addToSaveCategory,
);

router.delete(
  "/:savedCategoryId",
  getLoggedInUser,
  isVerified,
  SavedCategoryController.removeFromSaveCategoryBySavedCategoryId,
);

router.delete(
  "/category/:categoryId",
  getLoggedInUser,
  isVerified,
  SavedCategoryController.removeFromSaveCategoryByCategoryId,
);

export const SavedCategoryRoutes = router;
