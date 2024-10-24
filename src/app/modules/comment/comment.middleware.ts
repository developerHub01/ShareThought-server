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
import { ICommentPopulated } from "./comment.interface";

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
 * Permission handler middleware for comment actions.
 *
 * - Normal users (without any active channel):
 *   - Can create, update, or delete their own comments.
 *   - Cannot perform moderator-level actions like hide, show, pin, or unpin comments.
 * - Channel responsible users (authors or moderators with specific permissions):
 *   - Authors can create, update, delete, hide, show, pin, and unpin comments.
 *   - Moderators with the appropriate permissions can perform these actions on comments.
 *
 * @param action - The comment action being performed (e.g., create, update, delete, hide, show, pin, unpin).
 */
const havePermissionToComment = (action: keyof ICommentContextPermissions) =>
  catchAsync(async (req, res, next) => {
    const { id: commentId } = req.params;
    const { userId, channelId, channelRole, moderatorPermissions } =
      req as IRequestWithActiveDetails;

    // Retrieve comment data and populate the channel information
    const commentData =
      action !== "create" &&
      commentId &&
      ((await CommentModel.findById(commentId)
        .populate({
          path: "postId",
          select: "channelId",
        })
        .populate({
          path: "communityPostId",
          select: "channelId",
        })) as unknown as TDocumentType<ICommentPopulated>);

    // If action is not create and the comment is not found, throw an error
    if (action !== "create" && !commentData)
      throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

    /***
     * - Normal users without any active channel:
     *   - Cannot hide, show, pin, or unpin comments (moderator/author actions).
     *   - Can only update or delete their own comments.
     *   - Always allowed to create new comments.
     ***/
    if (!channelRole) {
      switch (action) {
        case "hide":
        case "show":
        case "pin":
        case "unpin":
          // Normal users cannot perform these actions
          throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not permitted to take that action",
          );
        case "create":
          return next(); // Normal users can always create comments
        case "update":
        case "delete":
          // Normal users can only update or delete their own comments
          if (
            commentData &&
            commentData?.commentAuthorId?.toString() !== userId
          )
            throw new AppError(
              httpStatus.FORBIDDEN,
              "This is not your comment",
            );
          return next();
        default:
          throw new AppError(httpStatus.FORBIDDEN, "Invalid action");
      }
    }

    /***
     * Channel responsible users (authors or moderators with permissions):
     * - Authors can create, hide, show, pin, unpin, update, or delete comments.
     * - Moderators can perform these actions if they have the appropriate permissions.
     ***/

    const isAuthor = channelRole === "AUTHOR"; // Check if the user is an author

    // Check moderator actions (hide, show, pin, unpin)
    if (["hide", "show", "pin", "unpin"].includes(action)) {
      if (!commentId)
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to take that action",
        );
    }

    // Authors can always perform these actions, otherwise check moderator permissions
    if (["hide", "show", "pin", "unpin", "create"].includes(action)) {
      if (isAuthor) return next();
      if (
        moderatorPermissions?.comment &&
        moderatorPermissions?.comment[action]
      )
        return next();
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not permitted to take that action",
      );
    }

    // Handling update and delete actions for channel responsible users
    if (["update", "delete"].includes(action)) {
      // Ensure that the user is updating/deleting their own comment (for normal users)
      if (
        action === "update" &&
        commentData &&
        commentData.commentAuthorId?.toString() !== userId
      )
        throw new AppError(httpStatus.FORBIDDEN, "This is not your comment");

      // Ensure the comment belongs to the correct channel
      if (
        commentData &&
        commentData?.postId?.channelId?.toString() !== channelId &&
        commentData?.communityPostId?.channelId?.toString() !== channelId
      )
        throw new AppError(httpStatus.FORBIDDEN, "This is not your channel");

      // Authors or permitted moderators can update or delete
      if (
        isAuthor ||
        (moderatorPermissions?.comment && moderatorPermissions?.comment[action])
      )
        return next();
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not permitted to take that action",
      );
    }

    // Handle any other invalid actions
    throw new AppError(httpStatus.FORBIDDEN, "Invalid action");
  });

export const CommentMiddleware = {
  createOrUpdateCommentImages,
  matchReqBodyFilesWithValidationSchema,
  havePermissionToComment,
};
