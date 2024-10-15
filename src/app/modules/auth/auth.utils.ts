import jwt, { JwtPayload } from "jsonwebtoken";
import {
  IErrorDetails,
  IJWTPayload,
  TEmailVarificationLinkGenerator,
  TForgetPasswordLinkGenerator,
} from "./auth.interface";
import { Request, Response } from "express";
import config from "../../config";
import AppError from "../../errors/AppError";

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
  return AuthUtils.createToken(
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

export const AuthUtils = {
  createToken,
  verifyToken,
  clearAllCookies,
  emailVerificationTokenGenerator,
  forgetPasswordTokenGenerator,
};
