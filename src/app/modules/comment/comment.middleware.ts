import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import {
  IRequestWithActiveDetails,
  TDocumentType,
} from "../../interface/interface";
import catchAsync from "../../utils/catch.async";
import { imageUpload } from "../../utils/multer.image.upload";
import { ICommentContextPermissions } from "../moderator/moderator.interface";
import { CommentModel } from "./model/model";
import { IComment } from "./comment.interface";

const createOrUpdateCommentImages = imageUpload.single("commentImage");

const matchReqBodyFilesWithValidationSchema = catchAsync(
  async (req, res, next) => {
    let commentImagePath;

    if (req?.body?.commentImage?.length)
      commentImagePath = req?.body?.commentImage[0];

    if (commentImagePath) req.body.commentImage = commentImagePath;

    next();
  },
);

/***
 * - comment create or modify can do by
 *    - normal user who don't have any active channel
 *       - can create, update or delete their comment
 *    - channel responsible user only can delete others comment on their post
 *    - and channel responsible user can modify their channel comments
 * **/

const havePermissionToComment = (action: keyof ICommentContextPermissions) =>
  catchAsync(async (req, res, next) => {
    const { id: commentId } = req.params;
    const { userId, channelId, channelRole, moderatorPermissions } =
      req as IRequestWithActiveDetails;

    const commentData =
      action !== "create" &&
      channelId &&
      ((await CommentModel.findById(commentId)) as TDocumentType<IComment>);

    if (action !== "create" && !commentData)
      throw new AppError(httpStatus.NOT_FOUND, "comment not found");

    /***
     * - if user is normal user
     *   - if actions are hide, show, pin, unpin then throw exception as these are moderators or author's actions
     *   - if actions is create then move to next
     *   - if actions are create or update then check that is it user's comment or not
     * **/
    if (!channelRole) {
      switch (action) {
        case "hide":
        case "show":
        case "pin":
        case "unpin":
          throw new AppError(
            httpStatus.FORBIDDEN,
            "you are not permitted to take that action",
          );
        case "create":
          return next(); // Normal users can always create comments
        case "update":
        case "delete":
          if (
            commentData &&
            commentData?.commentAuthorId?.toString() !== userId
          )
            throw new AppError(
              httpStatus.FORBIDDEN,
              "this is not your comment",
            );
          return next(); // Normal users can update/delete their own comments
        default:
          throw new AppError(httpStatus.FORBIDDEN, "Invalid action");
      }
    }

    /***
     * from here channel responsible user's action will check
     * **/

    const isAuthor = channelRole === "AUTHOR";

    /***
     * - if user is channel responsible user
     *   - if actions are hide, show, pin, unpin, create and if user is AUTHOR then move next else check that am I permitted to do so.
     *   - if actions are update or delete then check that is it my comment and I have that permissions
     * **/
    switch (action) {
      case "hide":
      case "show":
      case "pin":
      case "unpin":
      case "create":
        if (isAuthor)
          return next(); // Authors can always create/hide/show/pin/unpin
        else if (
          moderatorPermissions?.comment &&
          moderatorPermissions?.comment[action]
        )
          return next(); // Moderators can perform the action if they have permission
        else
          throw new AppError(
            httpStatus.FORBIDDEN,
            "you are not permitted to take that action",
          );
      case "update":
      case "delete":
        if (
          commentData &&
          commentData?.commentAuthorChannelId?.toString() !== channelId
        )
          throw new AppError(httpStatus.FORBIDDEN, "this is not your channel");

        if (
          isAuthor ||
          (moderatorPermissions?.comment &&
            moderatorPermissions?.comment[action])
        )
          return next(); // Authors or user who are permitted can always update/delete
        else
          throw new AppError(
            httpStatus.FORBIDDEN,
            "you are not permitted to take that action",
          );
      default:
        throw new AppError(httpStatus.FORBIDDEN, "Invalid action");
    }
  });

export const CommentMiddleware = {
  createOrUpdateCommentImages,
  matchReqBodyFilesWithValidationSchema,
  havePermissionToComment,
};
