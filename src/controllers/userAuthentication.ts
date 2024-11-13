import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import AuthService from "../services/authService";
import sendMail from "../utils/sendEmail";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import createSendToken from "../utils/createSendToken";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.createUser(req);

    sendMail("User Verification Email - ID Validation App", user);
    createSendToken(user, 201, res);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.idNumber || !req.body.password)
      return next(new AppError("Please input user ID and password", 400));

    const user = await AuthService.findById(req.body.idNumber);
    await AuthService.verifyPassword(user, req.body.password);
    await AuthService.isUserValidated(user.isValid);

    createSendToken(user, 200, res);
  }
);

const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.updateOne(
      { _id: req.params.id },
      { isValid: true },
      { runValidators: false }
    );

    res.redirect("/");
  }
);

const signout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("authToken", "loggedOut", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.redirect("/");
  }
);

export { signup, login, verifyUser, signout };
