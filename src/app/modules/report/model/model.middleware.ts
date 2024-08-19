import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { IReport } from "../report.interface";
import reportSchema from "./model.schema";
import { ReportConstant } from "../report.constant";

reportSchema.pre<IReport>("save", async function (next) {
  if (this.isReviewed)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "report can't be reviewed when reporting it",
    );

  if (!(this.userId || this.channelId) || !this.authorIdType)
    throw new AppError(httpStatus.BAD_REQUEST, "user must be logged in");
  if (
    !(
      this.contextChannel ||
      this.contextBlogPost ||
      this.contextCommunityPost ||
      this.contextComment
    )
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "report must contain channel, post or comment id",
    );

  if (this.reportType === ReportConstant.REPORT_TYPES.OTHER)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "other report types must contain report details",
    );

  next();
});
