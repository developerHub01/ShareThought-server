import express from "express";
import { ModeratorController } from "./moderator.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import { validateRequest } from "../../middleware/validate.request";
import { ModeratorValidation } from "./moderator.validation";
import readModeratorRequestToken from "../../middleware/read.moderator.request.token";
import isModerator from "../../middleware/is.moderator";
import checkModeratorStatus from "../../middleware/check.moderator.status";
import haveAccessRemoveModerator from "../../middleware/have.access.remove.moderator";
import checkChannelUserRole from "../../middleware/check.channel.user.role";

const router = express.Router();

/* accept moderation request send by SUPER_MODERATOR or AUTHOR */
router.get(
  "/accept_moderation_request",
  getLoggedInUser,
  readModeratorRequestToken,
  ModeratorController.acceptModerationRequest,
);

/* get all moderator under a channel */
router.get(
  "/",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  ModeratorController.getAllModerators,
);

/* get my moderation permissions under a channel */
router.get(
  "/me",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  ModeratorController.myModerationDetails,
);


/* get a specific moderator permissions under a channel */
router.get(
  "/:moderatorId",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  ModeratorController.singleModerator,
);


/* create a moderator */
router.post(
  "/",
  validateRequest(ModeratorValidation.createModeratorSchema),
  getLoggedInUser,
  getActiveChannel,
  ModeratorController.addModerator,
);

/* update a moderator permissions */
router.patch(
  "/:moderatorId",
  validateRequest(ModeratorValidation.updateModeratorSchema),
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelUserRole,
  ModeratorController.updateModerator,
);

/* resign from moderator role */
router.delete(
  "/resign",
  getLoggedInUser,
  getActiveChannel,
  isModerator(
    true,
  ) /* to resign user have to be moderator and also verified moderator */,
  ModeratorController.resign,
);

/* remove a moderator */
router.delete(
  "/:moderatorId",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  haveAccessRemoveModerator,
  ModeratorController.removeModerator,
);

export const ModeratorRoutes = router;
