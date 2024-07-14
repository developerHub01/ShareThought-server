import { Request } from "express";

export interface IRequestWithUserId extends Request {
  userId: string;
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
  [key: string]: IFileObject[]
}