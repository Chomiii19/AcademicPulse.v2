"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "development")
        sendDevError(err, res);
};
