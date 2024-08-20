import { Schema } from "mongoose";
import { IAppealReport, IAppealReportModel } from "../appeal.report.interface";
import { ReportConstant } from "../../report/report.constant";

const appealReportSchema = new Schema<IAppealReport, IAppealReportModel>(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: ReportConstant.REPORT_COLLECTION_NAME,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    evidenceImages: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
  },
);

export default appealReportSchema;
