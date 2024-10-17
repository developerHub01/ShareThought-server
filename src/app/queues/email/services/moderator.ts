import path from "path";
import ejs from "ejs";
import { format } from "date-fns";
import config from "../../../config";
import {
  IModeratorRequestAcceptanceEmailData,
  IModeratorRequestEmailData,
  IModeratorResignationEmailData,
} from "../../../modules/moderator/moderator.interface";
import { ModeratorUtils } from "../../../modules/moderator/moderator.utils";
import sendEmail from "../../../utils/sendEmail";

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
    "../../../../views/ModerationRequest.ejs",
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
    "../../../../views/ModeratorAcceptance.ejs",
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

const sendModeratorResignationEmail = async (
  emailDetails: IModeratorResignationEmailData,
) => {
  const { authorEmail, authorName, moderatorName, channelName } = emailDetails;

  const formatedDate = format(
    new Date(emailDetails.leaveDate),
    "MMMM do, yyyy H:mm:ss a",
  );

  const templatePath = path.join(
    __dirname,
    "../../../../views/ModeratorResignation.ejs",
  );

  const emailTemplateData = {
    AUTHOR_NAME: authorName,
    MODERATOR_NAME: moderatorName,
    MODERATOR_EMAIL: emailDetails.moderatorEmail,
    CHANNEL_NAME: channelName,
    CHANNEL_ID: emailDetails.channelId,
    LEAVE_DATE: formatedDate,
  };

  const htmlEmailTemplate = await ejs.renderFile(
    templatePath,
    emailTemplateData,
  );

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: authorEmail,
    subject: "Moderator Role Relinquished: Update for Your Channel",
    text: `Dear ${authorName}, 
         We wanted to inform you that ${moderatorName} has left the role of moderator for your channel "${channelName}" as of ${formatedDate}. 
         Please let us know if you require further assistance.`,
    html: htmlEmailTemplate, // Use the HTML template here
  });
};

export const ModeratorEmailServices = {
  sendModeratorRequestEmail,
  sendModeratorRequestAccptanceEmail,
  sendModeratorResignationEmail,
};
