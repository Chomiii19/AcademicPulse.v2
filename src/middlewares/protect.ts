import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import verifyToken from "../utils/verifyToken";

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;

    if (!token) {
      if (process.env.NODE_ENV === "production") return res.redirect("/");
      if (process.env.NODE_ENV === "development")
        return next(new AppError("Invalid token!", 401));
    }

    const decoded = await verifyToken(token);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError("The user belonging to this token doesn't exist", 401)
      );

    // console.log("JWT iat:", decoded.iat);
    // console.log("Password changed at:", currentUser.passwordChangedAt);
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    if (currentUser.passwordChangedAt) {
      return next(
        new AppError("User recently changed password. Please login again", 401)
      );
    }

    req.user = currentUser;
    next();
  }
);

export default protect;
