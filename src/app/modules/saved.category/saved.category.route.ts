import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { SavedCategoryController } from "./saved.category.controller";

const router = express.Router();

router.get("/", getLoggedInUser, SavedCategoryController.findSavedCategory);

router.post(
  "/:categoryId",
  getLoggedInUser,
  SavedCategoryController.addToSaveCategory,
);

router.delete(
  "/:savedCategoryId",
  getLoggedInUser,
  SavedCategoryController.removeFromSaveCategoryBySavedCategoryId,
);

router.delete(
  "/category/:categoryId",
  getLoggedInUser,
  SavedCategoryController.removeFromSaveCategoryByCategoryId,
);


export const SavedCategoryRoutes = router;
