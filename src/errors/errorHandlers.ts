import { Error as MongooseError } from "mongoose";
import AppError from "./appError";

const duplicateKeyHandler = (error: MongooseError) => {
  const value = error.errorResponse.errmsg.match(/(["'])(\\?.)*\1/)[0];
  const msg = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(msg, 400);
};

const validationErrorHandler = (error: AppError) => {
  const errors = Object.values(
    error.errors as Record<string, Error.ValidatorError>
  ).map((el) => el.message);
  const msg = `Error: ${errors.join(". ")}`;
  return new AppError(msg, 400);
};

const jwtErrorHandler = () =>
  new AppError("Invalid token. Please login again.", 401);

const tokenExpiredHandler = () =>
  new AppError("Your token has expired. Please login again.", 401);

export {
  duplicateKeyHandler,
  validationErrorHandler,
  jwtErrorHandler,
  tokenExpiredHandler,
};
