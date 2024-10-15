import ejs from "ejs";
import path from "path";
import { format } from "date-fns";
import sendEmail from "../../utils/sendEmail";
import {
  IModeratorRequestAcceptanceEmailData,
  IModeratorRequestEmailData,
} from "./moderator.interface";
import config from "../../config";
import { AuthUtils } from "../auth/auth.utils";

const moderatorRequestTokenGenerator = async (
  payload: Record<string, string>,
) => {
  return AuthUtils.createToken(
    payload,
    config.JWT_MODERATOR_REQUEST_SECRET,
    config.JWT_MODERATOR_REQUEST_EXPIRES_IN,
  );
};

const sendModeratorRequestEmail = async (
  emailDetails: IModeratorRequestEmailData,
) => {
  const { moderatorId, moderatorEmail } = emailDetails;

  const moderatorRequestToken =
    await ModeratorUtils.moderatorRequestTokenGenerator({
      moderatorId,
    });

  const moderatorRequestAcceptionLink = `${config.CLIENT_BASE_URL}/moderator_request_accept?token=${moderatorRequestToken}`;

  const templatePath = path.join(
    __dirname,
    "../../../views/ModerationRequest.ejs",
  );

  const emailTemplateData = {
    CHANNEL_COVER: emailDetails.channelCover,
    CHANNEL_AVATAR: emailDetails.channelAvatar,
    CHANNEL_NAME: emailDetails.channelName,
    MODERATOR_NAME: emailDetails.moderatorName,
    MODERATOR_AVATAR: emailDetails.moderatorAvatar,
    MODERATOR_EMAIL: emailDetails.moderatorEmail,
    CONFIRMATION_LINK: moderatorRequestAcceptionLink,
  };

  const htmlEmailTemplate = await ejs.renderFile(
    templatePath,
    emailTemplateData,
  );

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: moderatorEmail,
    subject: "Moderator Invitation: Join as a Channel Moderator",
    text: "You have been invited to join as a moderator for the channel. Please accept the request to manage the channel's content and community. If you did not request this, you can safely ignore this email.",
    html: htmlEmailTemplate,
  });
};

const sendModeratorRequestAccptanceEmail = async (
  emailDetails: IModeratorRequestAcceptanceEmailData,
) => {
  const { authorEmail } = emailDetails;

  const templatePath = path.join(
    __dirname,
    "../../../views/ModeratorAcceptance.ejs",
  );

  const emailTemplateData = {
    CHANNEL_COVER: emailDetails.channelCover,
    CHANNEL_NAME: emailDetails.channelName,
    AUTHOR_NAME: emailDetails.authorName,
    MODERATOR_NAME: emailDetails.moderatorName,
    MODERATOR_AVATAR: emailDetails.moderatorAvatar,
    MODERATOR_EMAIL: emailDetails.moderatorEmail,
    DATE_ACCEPTED: format(
      new Date(emailDetails.dateAccepted),
      "MMMM do, yyyy H:mm:ss a",
    ),
  };

  console.log({ emailTemplateData });

  const htmlEmailTemplate = await ejs.renderFile(
    templatePath,
    emailTemplateData,
  );

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: authorEmail,
    subject: "Moderator Request Accepted: New Moderator for Your Channel",
    text: "The moderator request for your channel has been accepted. Your channel now has an additional moderator to help manage content and the community.",
    html: htmlEmailTemplate,
  });
};

export const ModeratorUtils = {
  sendModeratorRequestEmail,
  moderatorRequestTokenGenerator,
  sendModeratorRequestAccptanceEmail,
};
