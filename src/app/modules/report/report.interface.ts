import { Model, Types } from "mongoose";
import { ReportConstant } from "./report.constant";

const reportTypes: Array<string> = Object.keys(ReportConstant.REPORT_TYPES);

const reportContextTypes: Array<string> = Object.keys(
  ReportConstant.REPORT_CONTEXT_TYPES,
);

const reportResponseTypes: Array<string> = Object.keys(
  ReportConstant.REPORT_RESPONSE_TYPES,
);

export type TReportTypes = (typeof reportTypes)[number];

export type TReportContextTypes = (typeof reportContextTypes)[number];

export type TReportResponseTypes = (typeof reportResponseTypes)[number];

export interface IReport {
  reportType: TReportTypes;
  userId?: string | Types.ObjectId;
  channelId?: string | Types.ObjectId;
  authorIdType?: "channelId" | "userId";
  contextChannel?: string | Types.ObjectId;
  contextBlogPost?: string | Types.ObjectId;
  contextCommunityPost?: string | Types.ObjectId;
  contextComment?: string | Types.ObjectId;
  reportContextType: TReportContextTypes;
  content: string;
  evidenceImages: Array<string>;
  isReviewed?: boolean;
  responseType?: TReportResponseTypes;
}

export interface IReportModel extends Model<IReport> {
}
