import { ReportModel } from "./model/model";
import { IReport } from "./report.interface";

const createReport = async (payload: IReport) => {
  return await ReportModel.createReport(payload);
};

export const ReportServices = {
  createReport,
};
