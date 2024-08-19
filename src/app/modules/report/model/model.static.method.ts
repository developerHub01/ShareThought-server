import errorHandler from "../../../errors/errorHandler";
import { TDocumentType } from "../../../interface/interface";
import { IReport } from "../report.interface";
import { ReportModel } from "./model";
import reportSchema from "./model.schema";

reportSchema.statics.createReport = async (
  payload: IReport,
): Promise<TDocumentType<IReport>> => {
  try {
    return await ReportModel.create(payload);
  } catch (error) {
    return errorHandler(error);
  }
};
