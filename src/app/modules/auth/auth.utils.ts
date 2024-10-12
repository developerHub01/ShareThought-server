import jwt, { JwtPayload } from "jsonwebtoken";
import { format } from "date-fns";
import {
  IErrorDetails,
  IJWTPayload,
  TEmailVarificationLinkGenerator,
  TForgetPasswordLinkGenerator,
} from "./auth.interface";
import { Request, Response } from "express";
import config from "../../config";
import AppError from "../../errors/AppError";
import { IUserLoginInfo, TDocumentType } from "../../interface/interface";
import { IUser } from "../user/user.interface";
import path from "path";
import ejs from "ejs";
import sendEmail from "../../utils/sendEmail";

const createToken = (
  jwtPayload: IJWTPayload,
  secret: string,
  expiresIn?: string,
) => {
  if (expiresIn)
    return jwt.sign(jwtPayload, secret, {
      expiresIn,
    });

  return jwt.sign(jwtPayload, secret);
};

const verifyToken = (
  token: string,
  secret: string,
  errorDetails?: IErrorDetails,
) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (!errorDetails) throw error;

    throw new AppError(errorDetails.statusCode, errorDetails.message);
  }
};

const clearAllCookies = (req: Request, res: Response) => {
  return Object.keys(req?.cookies).forEach((cookie) => res.clearCookie(cookie));
};

const emailVerificationTokenGenerator: TEmailVarificationLinkGenerator = (
  userData,
) => {
  return createToken(
    userData,
    config.JWT_EMAIL_VERIFICATION_SECRET,
    config.JWT_EMAIL_VERIFICATION_EXPIRES_IN,
  );
};

const forgetPasswordTokenGenerator: TForgetPasswordLinkGenerator = (
  userData,
) => {
  return createToken(
    userData,
    config.JWT_FORGET_PASSWORD_SECRET,
    config.JWT_FORGET_PASSWORD_EXPIRES_IN,
  );
};

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
  emailData: IUserLoginInfo & { fullName: string; email: string },
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

export const AuthUtils = {
  createToken,
  verifyToken,
  clearAllCookies,
  emailVerificationTokenGenerator,
  forgetPasswordTokenGenerator,
  sendVerificationEmail,
  sendForgetPasswordEmail,
  sendLoggedInUserInfoEmail,
};
