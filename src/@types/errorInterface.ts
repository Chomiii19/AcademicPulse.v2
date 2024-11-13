import AppError from "../errors/appError";

interface DuplicateKeyError extends AppError {
  errorResponse: { errmsg: string };
}

interface ValidationError extends AppError {
  errors: { [key: string]: { message: string } };
}

export { DuplicateKeyError, ValidationError };
