import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

const sendDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") sendDevError(err, res);
};
