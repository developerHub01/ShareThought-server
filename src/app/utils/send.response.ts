import {  Response } from "express";

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
}

export const sendResponse = <T>(res: Response, data: IResponse<T>) =>
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
