import express from "express";
import { ReportController } from "./report.controller";
import getLoggedInUser from "../../middleware/get.loggedin.user";
import isValidReport from "../../middleware/is.valid.report";
import { validateRequest } from "../../middleware/validate.request";
import { ReportValidation } from "./report.validation";
import readReqBodyFiles from "../../middleware/read.req.body.files";
import { ReportMiddleware } from "./report.middleware";
import checkChannelStatus from "../../middleware/check.channel.status";

const router = express.Router();

router.post(
  "/",
  ReportMiddleware.createReportImages,
  readReqBodyFiles,
  validateRequest(ReportValidation.createReportValidator),
  getLoggedInUser,
  checkChannelStatus,
  isValidReport,
  ReportController.createReport,
);

export const ReportRoutes = router;
