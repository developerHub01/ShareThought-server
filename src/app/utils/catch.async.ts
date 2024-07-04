import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (cb: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(cb(req, res, next)).catch((error) => next(error));
  };
};

export default catchAsync;
