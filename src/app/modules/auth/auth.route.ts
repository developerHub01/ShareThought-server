import express from "express";
import { validateRequest } from "../../middleware/validate.request";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.get("/logout", AuthController.logoutUser);

export const AuthRoutes = router;
