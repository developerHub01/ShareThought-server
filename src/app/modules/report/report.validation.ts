import { z as zod } from "zod";
import { ReportConstant } from "./report.constant";

const reportTypeList = Object.keys(ReportConstant.REPORT_TYPES) as [
  keyof typeof ReportConstant.REPORT_TYPES,
];

const reportContextTypeList = Object.keys(
  ReportConstant.REPORT_CONTEXT_TYPES,
) as [keyof typeof ReportConstant.REPORT_CONTEXT_TYPES];

const createReportValidator = zod.object({
  reportType: zod.enum(reportTypeList),
  contextChannel: zod
    .string({
      invalid_type_error: "channelId must be string",
    })
    .optional(),
  contextBlogPost: zod
    .string({ invalid_type_error: "postId must be string" })
    .optional(),
  contextCommunityPost: zod
    .string({ invalid_type_error: "postId must be string" })
    .optional(),
  contextComment: zod
    .string({
      invalid_type_error: "commentId must be string",
    })
    .optional(),
  reportContextType: zod.enum(reportContextTypeList),
  content: zod
    .string({
      required_error: "conent must required",
      invalid_type_error: "content must be string",
    })
    .optional(),
  evidenceImages: zod
    .string({
      invalid_type_error: "evidance image urls must be string",
    })
    .array()
    .optional(),
});

export const ReportValidation = {
  createReportValidator,
};
