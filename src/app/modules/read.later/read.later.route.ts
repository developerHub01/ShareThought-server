import express from "express";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import { ReadLaterController } from "./read.later.controller";

const router = express.Router();

/* 
*
* Is any post exist in read later list
* 
*/
router.get(
  "/:postId",
  getLoggedInUser,
  ReadLaterController.isExistInReadLaterList,
);

router.get("/", getLoggedInUser, ReadLaterController.findReadLaterList);

router.post(
  "/:postId",
  getLoggedInUser,
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
  ReadLaterController.removeFromReadLaterList,
);

export const ReadLaterRoutes = router;
