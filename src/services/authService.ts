import { Request } from "express";
import User from "../models/userModel";
import AppError from "../utils/appError";
import IUser from "../@types/userInterfaces";

class AuthService {
  async createUser(req: Request) {
    const user = await User.create({
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

    return user;
  }

  async findById(idNumber: string) {
    const user = await User.findOne({ idNumber }).select("+password");
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async verifyPassword(user: IUser, password: string) {
    if (!(await user?.comparePassword(password)))
      throw new AppError("Invalid password", 401);
  }

  async isUserValidated(user: boolean) {
    if (!user) throw new AppError("Account not verified", 401);
  }
}

export default new AuthService();
