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

router.get(
  "/emailVerifyRequest",
  getLoggedInUser,
  AuthController.emailVerifyRequest,
);

router.get("/verifyEmail/:token", getLoggedInUser, AuthController.verifyEmail);

router.post(
  "/forgotPassword",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword,
);

router.post(
  "/resetPassword",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword,
);

export const AuthRoutes = router;
