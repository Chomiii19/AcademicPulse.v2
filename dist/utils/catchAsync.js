"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Returns a new anonymous function
const catchAsync = (fn) => {
    return (req, res, next) => fn(req, res, next).catch((err) => next(err));
};
exports.default = catchAsync;
