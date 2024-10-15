import path from "path";
import ejs from "ejs";
import { format } from "date-fns";
import config from "../../../config";
import {
  IUserLoginInfoEmailData,
  TDocumentType,
} from "../../../interface/interface";
import { AuthUtils } from "../../../modules/auth/auth.utils";
import { IUser } from "../../../modules/user/user.interface";
import sendEmail from "../../../utils/sendEmail";

const sendVerificationEmail = async (userData: TDocumentType<IUser>) => {
  const { email, fullName, _id } = userData;

  const userId = _id?.toString();

  const verificationToken = AuthUtils.emailVerificationTokenGenerator({
    email,
    userId,
  });

  const verificationLink = `${config.CLIENT_BASE_URL}/auth/email_verify?token=${verificationToken}`;

  const templatePath = path.join(
    __dirname,
    "../../../views/EmailVarification.ejs",
  );

  const htmlEmailTemplate = await ejs.renderFile(templatePath, {
    VERIFICATION_LINK: verificationLink,
    FULL_NAME: fullName,
  });

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: email,
    subject: "Share Thought Email Verification",
    text: "Verify your email address to full access Share Thought functionalities",
    html: htmlEmailTemplate, // html body
  });
};

const sendForgetPasswordEmail = async (userData: TDocumentType<IUser>) => {
  const { email, fullName, _id } = userData;

  const userId = _id?.toString();

  const forgetPasswordToken = AuthUtils.forgetPasswordTokenGenerator({
    email,
    userId,
  });

  const resetPasswordLink = `${config.CLIENT_BASE_URL}/auth/reset_password?token=${forgetPasswordToken}`;

  const templatePath = path.join(
    __dirname,
    "../../../views/ForgetPassword.ejs",
  );

  const htmlEmailTemplate = await ejs.renderFile(templatePath, {
    RESET_PASSWORD_LINK: resetPasswordLink,
    FULL_NAME: fullName,
  });

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: email,
    subject: "Share Thought Reset Password",
    text: "You requested a password reset for your Share Thought account. Click the link in the email to set a new password.",
    html: htmlEmailTemplate, // html body
  });
};

const sendLoggedInUserInfoEmail = async (
  emailData: IUserLoginInfoEmailData,
) => {
  const { email, fullName } = emailData;
  const templatePath = path.join(
    __dirname,
    "../../../views/LoggedInUserInfo.ejs",
  );

  const emailTemplateData = {
    FULL_NAME: fullName,
    DEVICE: emailData.device,
    BROWSER: emailData.browser,
    IP: emailData.ip,
    CITY: emailData?.userLocation?.city,
    REGION_NAME: emailData?.userLocation?.region_name,
    COUNTRY_NAME: emailData?.userLocation?.country_name,
    COUNTRY_FLAG: emailData?.userLocation?.country_flag,
    LATITUDE: emailData?.userLocation?.latitude,
    LONGITUDE: emailData?.userLocation?.longitude,
    TIME: format(
      new Date(emailData?.userLocation?.time as string),
      "MMMM do, yyyy H:mm:ss a",
    ),
  };

  const htmlEmailTemplate = await ejs.renderFile(
    templatePath,
    emailTemplateData,
  );

  await sendEmail({
    from: config.ADMIN_USER_EMAIL,
    to: email,
    subject: "Security Alert: New Login Detected",
    text: "We detected a new login to your Share Thought account from a different location. If this wasn't you, please secure your account.",
    html: htmlEmailTemplate,
  });
};

export const AuthEmailServices = {
  sendVerificationEmail,
  sendForgetPasswordEmail,
  sendLoggedInUserInfoEmail,
};
