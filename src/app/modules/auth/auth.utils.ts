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

const createToken = ({
  jwtPayload,
  secret,
  expiresIn,
}: {
  jwtPayload: IJWTPayload,
  secret: string,
  expiresIn?: string,
}) => {
  if (expiresIn)
    return jwt.sign(jwtPayload, secret, {
      expiresIn,
    });

  return jwt.sign(jwtPayload, secret);
};

const verifyToken = ({
  token,
  secret,
  errorDetails,
}: {
  token: string,
  secret: string,
  errorDetails?: IErrorDetails,
}) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (!errorDetails) throw error;

    throw new AppError(errorDetails.statusCode, errorDetails.message);
  }
};

const clearAllCookies = ({ req, res }: { req: Request, res: Response }) => {
  return Object.keys(req?.cookies).forEach((cookie) => res.clearCookie(cookie));
};

const emailVerificationTokenGenerator: TEmailVarificationLinkGenerator = (
  userData,
) => {
  return AuthUtils.createToken({
    jwtPayload: userData,
    secret: config.JWT_EMAIL_VERIFICATION_SECRET,
    expiresIn: config.JWT_EMAIL_VERIFICATION_EXPIRES_IN,
  });
};

const forgetPasswordTokenGenerator: TForgetPasswordLinkGenerator = (
  userData,
) => {
  return createToken({
    jwtPayload: userData,
    secret: config.JWT_FORGET_PASSWORD_SECRET,
    expiresIn: config.JWT_FORGET_PASSWORD_EXPIRES_IN,
  });
};

export const AuthUtils = {
  createToken,
  verifyToken,
  clearAllCookies,
  emailVerificationTokenGenerator,
  forgetPasswordTokenGenerator,
};
