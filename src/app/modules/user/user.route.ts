import express from "express";
import { validateRequest } from "../../middleware/validate.request";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

export const UserRoutes = router;
