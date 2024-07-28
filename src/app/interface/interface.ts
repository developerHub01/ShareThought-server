import { Request } from "express";

export interface IRequestWithActiveDetails extends Request {
  userId: string;
  channelId?: string;
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

export type TPostType = "blogPost" | "communityPost";
export type TAuthorType = "userId" | "channelId";