import { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import AppError from "../utils/appError";
import verifyToken from "../utils/verifyToken";

class UserService {
  async checkToken(token: string) {
    if (!token) throw new AppError("Your are not logged in!", 401);
    const decoded = await verifyToken(token);
    return decoded;
  }

  async findById(id: JwtPayload[string]) {
    const user = await User.findById(id);
    if (!user) throw new AppError("User does not exist.", 404);
    return user;
  }

  async findByIdAndUpdate(id: JwtPayload[string], body: Object) {
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError("User not found!", 404);
    return user;
  }

  async findByIdAndDelete(id: JwtPayload[string]) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError("User not found!", 404);
  }
}

export default new UserService();
