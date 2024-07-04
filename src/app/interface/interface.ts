import { Request } from "express";

export interface IRequestWithUserId extends Request {
  userId: string;
}
