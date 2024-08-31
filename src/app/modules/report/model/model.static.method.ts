import { TDocumentType } from "../../../interface/interface";
import { IReport } from "../report.interface";
import { ReportModel } from "./model";
import reportSchema from "./model.schema";

reportSchema.statics.createReport = async (
  payload: IReport,
): Promise<TDocumentType<IReport>> => {
    return await ReportModel.create(payload);
};
