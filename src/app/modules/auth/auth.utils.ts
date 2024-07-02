import jwt, { JwtPayload } from "jsonwebtoken";
import { IJWTPayload } from "./auth.interface";

const createToken = (
  jwtPayload: IJWTPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const AuthUtils = {
  createToken,
  verifyToken,
};
