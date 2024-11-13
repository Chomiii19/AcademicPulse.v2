class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(msg, statusCode) {
        super(msg);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
