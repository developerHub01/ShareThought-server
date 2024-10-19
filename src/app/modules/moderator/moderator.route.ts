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
import checkChannelRoleType from "../../middleware/check.channel.role.type";

const router = express.Router();

router.get(
  "/",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  checkChannelRoleType,
  ModeratorController.getAllModerators,
);

router.get(
  "/accept_moderation_request",
  getLoggedInUser,
  readModeratorRequestToken,
  ModeratorController.acceptModerationRequest,
);

router.post(
  "/",
  validateRequest(ModeratorValidation.createModeratorSchema),
  getLoggedInUser,
  getActiveChannel,
  ModeratorController.addModerator,
);

router.patch(
  "/:moderatorId",
  validateRequest(ModeratorValidation.updateModeratorSchema),
  getLoggedInUser,
  getActiveChannel,
  ModeratorController.addModerator,
);

router.delete(
  "/resign",
  getLoggedInUser,
  getActiveChannel,
  isModerator(
    true,
  ) /* to resign user have to be moderator and also verified moderator */,
  ModeratorController.resign,
);

router.delete(
  "/:moderatorId",
  getLoggedInUser,
  getActiveChannel,
  checkModeratorStatus,
  haveAccessRemoveModerator,
  ModeratorController.removeModerator,
);

export const ModeratorRoutes = router;
