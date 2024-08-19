import httpStatus from "http-status";

import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { ReportUtils } from "./report.utils";
import { CloudinaryConstant } from "../../constants/cloudinary.constant";
import { ReportServices } from "./report.services";
import { IRequestWithActiveDetails } from "../../interface/interface";

const createReport = catchAsync(async (req, res) => {
  const { userId, channelId } = req as IRequestWithActiveDetails;

  if (req.body?.evidenceImages) {
    const evidenceImages = await ReportUtils.createReportImage(
      req.body?.evidenceImages,
      CloudinaryConstant.SHARE_THOUGHT_REPORT_FOLDER_NAME,
      false,
    );
    req.body.evidenceImages = evidenceImages;
  }

  const payload = {
    ...req.body,
    ...(channelId ? { channelId } : { userId }),
    channelId,
    authorIdType: channelId ? "channelId" : "userId",
  };

  const result = await ReportServices.createReport(payload);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "report submitted succesfully",
    data: result,
  });
});

export const ReportController = {
  createReport,
};
