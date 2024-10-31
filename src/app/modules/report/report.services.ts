import { ReportModel } from "./model/model";
import { IReport } from "./report.interface";

const createReport = async ({ payload }: { payload: IReport }) => {
  return await ReportModel.create(payload);
};

export const ReportServices = {
  createReport,
};
