import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import CheckoutService from "../services/checkoutService";
import AppError from "../errors/appError";

const checkoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return new AppError("Your account does not have an email", 400);

    const session = await CheckoutService.stripeConfig(req.user.email);

    res.status(200).json({
      status: "Success",
      session,
    });
  }
);

export default checkoutSession;
