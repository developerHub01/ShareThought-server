import express from "express";
import { ModeratorController } from "./moderator.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import { validateRequest } from "../../middleware/validate.request";
import { ModeratorValidation } from "./moderator.validation";
import readModeratorRequestToken from "../../middleware/read.moderator.request.token";

const router = express.Router();

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
  "/leave_moderator_role",
  getLoggedInUser,
  getActiveChannel,
  ModeratorController.leaveModeratorRole,
);

router.delete(
  "/:moderatorId",
  getLoggedInUser,
  getActiveChannel,
  ModeratorController.deleteModerator,
);


export const ModeratorRoutes = router;
