import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";

const roleAuthorization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ idNumber: req.user?.idNumber });

    if (!user) return next(new AppError("User account does not exist!", 404));
    if (user.role !== "admin") return res.redirect("/app/unauthorized");

    next();
  }
);

export default roleAuthorization;
