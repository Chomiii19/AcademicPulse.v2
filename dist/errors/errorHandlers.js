import AppError from "./appError";
const duplicateKeyHandler = (error) => {
    const value = error.errorResponse.errmsg.match(/(["'])(\\?.)*\1/);
    if (!value)
        throw new Error("Error message pattern not found");
    const msg = `Duplicate field value: ${value[0]}. Please use another value.`;
    return new AppError(msg, 400);
};
const validationErrorHandler = (error) => {
    const errors = Object.values(error.errors).map((el) => el.message);
    const msg = `Error: ${errors.join(". ")}`;
    return new AppError(msg, 400);
};
const jwtErrorHandler = () => new AppError("Invalid token. Please login again.", 401);
const tokenExpiredHandler = () => new AppError("Your token has expired. Please login again.", 401);
export { duplicateKeyHandler, validationErrorHandler, jwtErrorHandler, tokenExpiredHandler, };
