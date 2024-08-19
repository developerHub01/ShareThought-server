import { model } from "mongoose";
import { ReportConstant } from "../report.constant";
import { IReport, IReportModel } from "../report.interface";

/* report scheme start ====== */
import reportSchema from "./model.schema";
/* report scheme end ===== */

/* report schema middleware start ==== */
import "./model.middleware";
/* report schema middleware end ==== */

/* report schema static methods start ==== */
import "./model.static.method";
/* report schema static methods end ==== */

export const ReportModel = model<IReport, IReportModel>(
  ReportConstant.REPORT_COLLECTION_NAME,
  reportSchema,
);
