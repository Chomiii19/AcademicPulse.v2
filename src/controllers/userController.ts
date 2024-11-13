import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import UserService from "../services/userService";

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = await UserService.checkToken(req.cookies.authToken);
    const user = await UserService.findById(decoded.id);

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = await UserService.checkToken(req.cookies.authToken);
    const user = await UserService.findByIdAndUpdate(decoded.id, req.body);

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = await UserService.checkToken(req.cookies.authToken);
    await UserService.findByIdAndDelete(decoded.id);

    res.clearCookie("authToken");
    res.status(200).json({
      status: "Success",
      message: "User successfully deleted",
    });
  }
);

export { getUser, updateUser, deleteUser };
