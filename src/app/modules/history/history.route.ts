import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { HistoryController } from "./history.controller";
import isVerified from "../../middleware/is.verified";

const router = express.Router();

/* search in history */
router.get("/", getLoggedInUser, isVerified, HistoryController.findHistoryItem);

/* check current history activity play or pause */
router.get(
  "/activity",
  getLoggedInUser,
  isVerified,
  HistoryController.isMyHistoryActive,
);

/* add new post in history */
router.post(
  "/post/:postId",
  getLoggedInUser,
  isVerified,
  HistoryController.addPostInHistory,
);

/* change history activity play or pause */
router.patch(
  "/change_activity",
  getLoggedInUser,
  isVerified,
  HistoryController.toggleHistoryActivity,
);

/* clear whole history */
router.delete(
  "/",
  getLoggedInUser,
  isVerified,
  HistoryController.clearPostFromHistory,
);

/* remove an post item from history */
router.delete(
  "/:id",
  getLoggedInUser,
  isVerified,
  HistoryController.removePostFromHistory,
);

export const HistoryRoutes = router;
