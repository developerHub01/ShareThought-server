import { Request } from "express";

export interface IRequestWithActiveDetails extends Request {
  userId: string;
  channelId?: string;
  guestId?: string;
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
