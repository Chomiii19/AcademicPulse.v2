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
exports.loggedInChecker = exports.signout = exports.protect = exports.roleAuthorization = exports.verifyUser = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
// import verifyToken from "../utils/verifyToken";
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY));
});
const signToken = (id) => {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey)
        throw new Error("There was an error finding the secret key.");
    return jsonwebtoken_1.default.sign({ id }, secretKey, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieExpiry = Number(process.env.JWT_COOKIE_EXPIRES_IN);
    console.log(cookieExpiry);
    if (!cookieExpiry)
        throw new Error("There was an error finding the secret key.");
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiry * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("authToken", token, cookieOptions);
    //   res.redirect("/app");
    res.status(statusCode).json({
        status: "Success",
        data: {
            user,
        },
    });
};
const signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello");
    const user = yield userModel_1.default.create({
        idNumber: req.body.idNumber,
        surname: req.body.surname,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        extension: req.body.extension,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        isValid: req.body.isValid,
    });
    (0, sendEmail_1.default)("User Verification Email - ID Validation App", user);
    createSendToken(user, 201, res);
}));
exports.signup = signup;
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.idNumber || !req.body.password)
        return next(new appError_1.default("Please input user ID and password", 400));
    const user = yield userModel_1.default.findOne({ idNumber: req.body.idNumber }).select("+password");
    if (!user || !(yield (user === null || user === void 0 ? void 0 : user.comparePassword(req.body.password))))
        return next(new appError_1.default("Invalid password", 401));
    if (!user.isValid)
        return next(new appError_1.default("Account not verified", 401));
    createSendToken(user, 201, res);
}));
exports.login = login;
const verifyUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.updateOne({ _id: req.params.id }, { isValid: true }, { runValidators: false });
    res.redirect("/");
}));
exports.verifyUser = verifyUser;
const protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token) {
        if (process.env.NODE_ENV === "production")
            return res.redirect("/");
        if (process.env.NODE_ENV === "development")
            return next(new appError_1.default("Invalid token!", 401));
    }
    const decoded = yield verifyToken(token);
    const currentUser = yield userModel_1.default.findById(decoded.id);
    if (!currentUser)
        return next(new appError_1.default("The user belonging to this token doesn't exist", 401));
    // console.log("JWT iat:", decoded.iat);
    // console.log("Password changed at:", currentUser.passwordChangedAt);
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    if (currentUser.passwordChangedAt) {
        return next(new appError_1.default("User recently changed password. Please login again", 401));
    }
    req.user = currentUser;
    next();
}));
exports.protect = protect;
const roleAuthorization = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield userModel_1.default.findOne({ idNumber: (_a = req.user) === null || _a === void 0 ? void 0 : _a.idNumber });
    if (!user)
        return next(new appError_1.default("User account does not exist!", 404));
    if (user.role !== "admin")
        return res.redirect("/app/unauthorized");
    next();
}));
exports.roleAuthorization = roleAuthorization;
const signout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("authToken", "loggedOut", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.redirect("/");
}));
exports.signout = signout;
const loggedInChecker = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    console.log(token);
    if (!token)
        return res.redirect("/");
    const decoded = yield verifyToken(token);
    const user = yield userModel_1.default.findById(decoded.id);
    if (user)
        return res.redirect("/app");
    else
        return res.redirect("/users/signout");
}));
exports.loggedInChecker = loggedInChecker;
