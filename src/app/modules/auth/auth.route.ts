import express from "express";
import { validateRequest } from "../../middleware/validate.request";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import readForgetPasswordToken from "../../middleware/read.forgetPassword.token";
import readVerifyEmailToken from "../../middleware/read.verifyEmail.token";
import getLoginInfo from "../../middleware/get.login.info";

const router = express.Router();

/**
 * Main auth
 * ***/
router.post(
  "/login",
  /* guestId will automatically find through createGuestUserIfNeed middleware */
  validateRequest(AuthValidation.loginValidationSchema),
  getLoginInfo,
  AuthController.loginUser,
);

router.get("/logout", getLoggedInUser, AuthController.logoutUser);

/**
 * Email verification
 * ***/
router.get(
  "/emailVerifyRequest",
  getLoggedInUser,
  AuthController.emailVerifyRequest,
);

router.get("/verifyEmail", readVerifyEmailToken, AuthController.verifyEmail);

/**
 * forget password
 * ***/
router.post(
  "/forgotPassword",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword,
);

router.post(
  "/resetPassword",
  readForgetPasswordToken,
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoutes = router;
