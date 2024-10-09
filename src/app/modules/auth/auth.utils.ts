import jwt, { JwtPayload } from "jsonwebtoken";
import {
  IErrorDetails,
  IJWTPayload,
  TEmailVarificationLinkGenerator,
} from "./auth.interface";
import { Request, Response } from "express";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TDocumentType } from "../../interface/interface";
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

export const AuthUtils = {
  createToken,
  verifyToken,
  clearAllCookies,
  emailVerificationTokenGenerator,
  sendVerificationEmail,
};
