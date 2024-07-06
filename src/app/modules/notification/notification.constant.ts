import { CommentReactionConstant } from "../comment.reaction/comment.reaction.constant";
import { PostReactionConstant } from "../post.reaction/post.reaction.constant";
import { NotificationUtils } from "./notification.utils";
const NOTIFICATION_COLLECTION_NAME = "Notification";


/* 
*
* This types will help to identify the notification type
*
*/
const POST_REACTION = "POST_REACTION";
const COMMENT_REACTION = "COMMENT_REACTION";

const NOTIFICATION_TYPES = {
  POST_PUBLISH: "POST_PUBLISH",
  POST_COMMENT: "POST_COMMENT",
  ...NotificationUtils.generateReactionNotificationType(
    POST_REACTION,
    PostReactionConstant.POST_REACTION_TYPES,
  ),
  ...NotificationUtils.generateReactionNotificationType(
    COMMENT_REACTION,
    CommentReactionConstant.COMMENT_REACTION_TYPES,
  ),
};

export const NotificationConstant = {
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_TYPES,
};
