import { NextFunction, Request, Response } from "express";
import AppError from "../errors/appError";
import * as errorHandlers from "../errors/errorHandlers";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR: ", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error?.errorResponse?.code === 11000)
      error = errorHandlers.duplicateKeyHandler(error);
    if (error?.name === "ValidationError")
      error = errorHandlers.validationErrorHandler(error);
    if (error?.name === "TokenExpiredError")
      error = errorHandlers.tokenExpiredHandler();
    if (error?.name === "JsonWebTokenError")
      error = errorHandlers.jwtErrorHandler();

    sendErrorProd(error, res);
  }
};
