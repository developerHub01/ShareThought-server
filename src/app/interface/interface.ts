import { Request } from "express";
import { Document, Types } from "mongoose";
import { IModeratorPermissions } from "../modules/moderator/moderator.interface";
import { TChannelRole } from "../modules/channel/channel.interface";

export interface IForgetPasswordTokenData {
  email: string;
  userId: string;
}
export interface IVerifyEmailTokenData {
  email: string;
  userId: string;
}

export interface IRequestWithActiveDetails extends Request {
  userId: string;
  channelId?: string;
  guestId?: string;
  moderatorId?: string;
  forgetPasswordTokenData?: IForgetPasswordTokenData;
  verifyEmailTokenData?: IVerifyEmailTokenData;
  isVerified?: boolean;
  userLoginInfo: IUserLoginInfo;
  moderatorPermissions?: IModeratorPermissions;
  isVerifiedModerator?: boolean;
  channelRole: TChannelRole;
  isMyPost: boolean;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
}

export interface IFileObject {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  filename?: string;
  path?: string;
  size?: number;
}

export interface IReqFiles {
  [key: string]: IFileObject[];
}

export type RequireExactlyOne<T, K extends keyof T = keyof T> = {
  [P in K]-?: {
    [Q in P]: T[Q];
  } & Partial<Omit<T, P>>;
};

export type TPostType = "blogPost" | "communityPost";
export type TAuthorType = "userId" | "channelId";
export type TGender = "male" | "female";

export interface IMediaFileDimension {
  width: number;
  height: number;
}

export interface IEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export type TDocumentType<T> = Document<unknown, object, T> &
  T & {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

export interface IIPDetailsInfo {
  country_name: string;
  region_name: string;
  city: string;
  country_flag: string;
  latitude: string;
  longitude: string;
  time: string | Date;
}

export interface IUserLoginInfo {
  device: string;
  browser: string;
  ip: string;
  userLocation?: IIPDetailsInfo;
}

export interface IUserLoginInfoEmailData extends IUserLoginInfo {
  fullName: string;
  email: string;
}
