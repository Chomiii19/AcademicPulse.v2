import User from "../models/userModel";
import AppError from "../errors/appError";
import verifyToken from "../utils/verifyToken";
class UserService {
    async checkToken(token) {
        if (!token)
            throw new AppError("You are not logged in!", 401);
        const decoded = await verifyToken(token);
        return decoded;
    }
    async findById(id) {
        const user = await User.findById(id);
        if (!user)
            throw new AppError("User does not exist.", 404);
        return user;
    }
    async findByIdAndUpdate(id, body) {
        const user = await User.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!user)
            throw new AppError("User not found!", 404);
        return user;
    }
    async findByIdAndDelete(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user)
            throw new AppError("User not found!", 404);
    }
}
export default new UserService();
