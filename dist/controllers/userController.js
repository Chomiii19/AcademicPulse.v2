"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token)
        return next(new appError_1.default("Your are not logged in!", 401));
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
    const user = yield userModel_1.default.findById(decoded.id);
    if (!user)
        return next(new appError_1.default("User does not exist.", 404));
    res.status(200).json({
        status: "Success",
        data: {
            user,
        },
    });
}));
exports.getUser = getUser;
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token)
        return next(new appError_1.default("Your are not logged in!", 401));
    const decoded = yield (0, verifyToken_1.default)(token);
    const tokenOwner = yield userModel_1.default.findById(decoded.id);
    if (!tokenOwner)
        return next(new appError_1.default("User not found!", 404));
    const user = yield userModel_1.default.findByIdAndUpdate(decoded.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "Success",
        data: {
            user,
        },
    });
}));
exports.updateUser = updateUser;
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token)
        return next(new appError_1.default("Your are not logged in!", 401));
    const decoded = yield (0, verifyToken_1.default)(token);
    const tokenOwner = yield userModel_1.default.findById(decoded.id);
    if (!tokenOwner)
        return next(new appError_1.default("User not found!", 404));
    yield userModel_1.default.findByIdAndDelete(decoded.id);
    res.clearCookie("authToken");
    res.status(200).json({
        status: "Success",
        message: "User successfully deleted",
    });
}));
exports.deleteUser = deleteUser;
