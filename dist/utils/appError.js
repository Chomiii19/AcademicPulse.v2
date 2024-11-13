"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(msg, statusCode) {
        super(msg);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
