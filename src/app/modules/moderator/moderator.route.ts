import express from "express";
import { ModeratorController } from "./moderator.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import getActiveChannel from "../../middleware/get.active.channel";
import { validateRequest } from "../../middleware/validate.request";
import { ModeratorValidation } from "./moderator.validation";
import readModeratorRequestToken from "../../middleware/read.moderator.request.token";

const router = express.Router();

router.post(
  "/",
  validateRequest(ModeratorValidation.moderatorSchema),
  getLoggedInUser,
  getActiveChannel,
  ModeratorController.addModerator,
);

router.get(
  "/accept_moderation_request",
  getLoggedInUser,
  readModeratorRequestToken,
  ModeratorController.acceptModerationRequest,
);

export const ModeratorRoutes = router;
