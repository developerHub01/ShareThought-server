import jwt, { JwtPayload } from "jsonwebtoken";
import { IJWTPayload } from "./auth.interface";
import { Request, Response } from "express";

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

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

const clearAllCookies = (req: Request, res: Response) => {
  return Object.keys(req?.cookies).forEach((cookie) => res.clearCookie(cookie));
};

export const AuthUtils = {
  createToken,
  verifyToken,
  clearAllCookies,
};
