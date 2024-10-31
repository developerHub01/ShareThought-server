import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { ReadLaterController } from "./read.later.controller";
import isVerified from "../../middleware/is.verified";

const router = express.Router();

/*
 *
 * Is any post exist in read later list
 *
 */
router.get(
  "/:postId",
  getLoggedInUser,
  isVerified,
  ReadLaterController.isExistInReadLaterList,
);

router.get("/", getLoggedInUser, ReadLaterController.findReadLaterList);

router.post(
  "/:postId",
  getLoggedInUser,
  isVerified,
  ReadLaterController.addToReadLaterList,
);

/* **
 *
 * find is an post is in my read later list by that readlist id
 *
 * */
router.delete(
  "/:id",
  getLoggedInUser,
  isVerified,
  ReadLaterController.removeFromReadLaterListById,
);

/* **
 *
 * find is an post is in my read later list by that post id
 *
 * */
router.delete(
  "/post/:postId",
  getLoggedInUser,
  isVerified,
  ReadLaterController.removeFromReadLaterList,
);

export const ReadLaterRoutes = router;
