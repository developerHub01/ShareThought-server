import { model } from "mongoose";
import { IAppealReport, IAppealReportModel } from "../appeal.report.interface";
import { AppealReportConstant } from "../appeal.report.constant";

/* appealReport schema start ==== */
import appealReportSchema from "./model.schema";
/* appealReport schema end ==== */

/* appealReport schema middleware start ==== */
import "./model.middleware";
/* appealReport schema middleware end ==== */

/* appealReport schema static methods start ==== */
import "./model.middleware";
/* appealReport schema static methods end ==== */

export const AppealReportModel = model<IAppealReport, IAppealReportModel>(
  AppealReportConstant.APPEAL_REPORT_COLLECTION_NAME,
  appealReportSchema,
);
