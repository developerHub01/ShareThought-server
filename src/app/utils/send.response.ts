import {  Response } from "express";
import { IResponse } from "../interface/interface";

export const sendResponse = <T>(res: Response, data: IResponse<T>) =>
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
