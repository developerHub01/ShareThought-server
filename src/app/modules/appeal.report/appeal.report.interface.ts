import { Model, Types } from "mongoose";

export interface IAppealReport {
  reportId: string | Types.ObjectId;
  content: string;
  evidenceImages: Array<string>;
}

export interface IAppealReportModel extends Model<IAppealReport> {}
