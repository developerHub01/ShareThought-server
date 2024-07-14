import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { HistoryController } from "./history.controller";

const router = express.Router();

/* search in history */
router.get("/", getLoggedInUser, HistoryController.findHistoryItem);

/* check current history activity play or pause */
router.get("/activity", getLoggedInUser, HistoryController.isMyHistoryActive);

/* add new post in history */
router.post(
  "/post/:postId",
  getLoggedInUser,
  HistoryController.addPostInHistory,
);

/* change history activity play or pause */
router.patch(
  "/change_activity",
  getLoggedInUser,
  HistoryController.toggleHistoryActivity,
);

/* clear whole history */
router.delete("/", getLoggedInUser, HistoryController.clearPostFromHistory);

/* remove an post item from history */
router.delete("/:id", getLoggedInUser, HistoryController.removePostFromHistory);


export const HistoryRoutes = router;
