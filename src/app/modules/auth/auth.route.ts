import express from "express";
import { validateRequest } from "../../middleware/validate.request";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import checkGuestStatus from "../../middleware/check.guest.status";
import getLoggedInUser from "../../middleware/get.loggedin.user";

const router = express.Router();

router.post(
  "/login",
  checkGuestStatus,
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.get("/logout", getLoggedInUser, AuthController.logoutUser);

export const AuthRoutes = router;
